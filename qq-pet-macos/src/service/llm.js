const _require = eval("require");
const https = _require("https");

const DEEPSEEK_HOST = "api.deepseek.com";
const DEFAULT_MODEL = "deepseek-chat";
const MAX_QUEUE = 3;
const TIMEOUT_MS = 8000;

const SYSTEM_PROMPT = (petInfo) => {
  const info = petInfo?.info || {};
  const maxInfo = petInfo?.maxInfo || {};
  return (
    `你是主人「${info.host || "主人"}」的桌宠，名叫「${info.name || "宠物"}」，是一只可爱的企鹅。` +
    `说话风格：活泼可爱，句子15字以内，用第一人称，偶尔提到主人名字。` +
    `当前状态：心情${info.mood || 0}/1000，等级${maxInfo.level || 1}，健康${info.health || 5}/10。` +
    `只回复JSON，格式：{"tolk":"宠物说的话（15字内）","submitText":"主人回应（5字内）"}`
  );
};

const USER_PROMPTS = {
  smallTalk: "宠物在日常闲聊，说一句有趣的生活感悟或小抱怨。",
  toHeartTolk: "主人刚刚摸了摸宠物，宠物感受到互动，说一句温暖的撒娇话。",
};

const MAX_CLIPBOARD_LEN = 500;
const DYNAMIC_PROMPTS = {
  clipboardText: (text) =>
    `主人刚刚复制了一段内容：\n"""\n${text}\n"""\n` +
    `请简短俏皮地评论一下这段内容是什么（如代码/邮件/链接/聊天/数字等），或鼓励主人。不要复述原文。`,
  godMode: () =>
    `主人刚刚按了"上帝模式"快捷键（Ctrl+方向键），俏皮回应他这个神秘按键，可以装作收到了神秘信号。`,
  enter: (ctx) =>
    `现在是${ctx.timeStr}，距上次见面${ctx.intervalStr}。说一句温暖的入场问候，` +
    `要带上主人称呼，体现时间和间隔感（凌晨提醒早睡、深夜关心、白天精神等）。`,
  stateEat: (ctx) =>
    `宠物饥饿值剩 ${ctx.percent}%（${ctx.value}/${ctx.max}）。` +
    `${ctx.percent < 20 ? "已经很饿了" : ctx.percent < 50 ? "有点饿" : "稍微饿"}，` +
    `说一句撒娇求吃的话，体现具体饥饿程度。`,
  stateClean: (ctx) =>
    `宠物清洁值剩 ${ctx.percent}%（${ctx.value}/${ctx.max}）。` +
    `${ctx.percent < 20 ? "已经很脏了" : ctx.percent < 50 ? "有点脏" : "稍微脏"}，` +
    `说一句求洗澡的话，体现脏污程度。`,
  levUp: (ctx) =>
    `宠物刚升级到 ${ctx.level} 级（${ctx.ageStage}阶段）！` +
    `说一句开心炫耀的话，体现里程碑感。`,
  focusEye: (ctx) =>
    `主人已经连续盯屏 ${ctx.activeMin} 分钟了。说一句关心眼睛的话，` +
    `提醒远眺或休息，要温暖不说教。`,
  sedentary: (ctx) =>
    `主人坐着不动已经 ${ctx.sedentaryMin} 分钟了。` +
    `说一句催促起身活动的话，可以撒娇或调皮，但要有真切的关心。`,
  lateNight: (ctx) =>
    `现在是${ctx.hour}点，深夜了主人还在工作。` +
    `说一句劝主人早睡的话，要心疼但不啰嗦。`,
  welcomeBack: (ctx) =>
    `主人离开 ${ctx.awayMin} 分钟后刚刚回来。` +
    `说一句开心的欢迎话，体现想念感和久别重逢。`,
};

function callDeepSeek(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const model =
      (typeof getSys === "function" && getSys("llmModel")) || DEFAULT_MODEL;
    const body = JSON.stringify({
      model,
      messages,
      max_tokens: 80,
      temperature: 0.9,
    });
    const req = https.request(
      {
        hostname: DEEPSEEK_HOST,
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) return reject(new Error(parsed.error.message));
            const content = parsed.choices?.[0]?.message?.content || "";
            const cleaned = content.replace(/```json|```/g, "").trim();
            resolve(JSON.parse(cleaned));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.write(body);
    req.end();
  });
}

class LLMService {
  _queues = {};
  _pending = {};

  dequeue(tolkName) {
    return this._queues[tolkName]?.shift() || null;
  }

  prefetch(tolkName, petInfo) {
    const apiKey = getSys("llmApiKey");
    if (!apiKey || !getSys("llmEnabled")) return;
    if (!this._queues[tolkName]) this._queues[tolkName] = [];
    if (this._queues[tolkName].length >= MAX_QUEUE || this._pending[tolkName]) return;
    this._pending[tolkName] = true;
    const prompt = USER_PROMPTS[tolkName] || USER_PROMPTS.smallTalk;
    callDeepSeek(apiKey, [
      { role: "system", content: SYSTEM_PROMPT(petInfo) },
      { role: "user", content: prompt },
    ])
      .then((r) => {
        if (r?.tolk) this._queues[tolkName].push(r);
      })
      .catch(() => {})
      .finally(() => {
        this._pending[tolkName] = false;
      });
  }

  test(apiKey, petInfo) {
    return callDeepSeek(apiKey, [
      { role: "system", content: SYSTEM_PROMPT(petInfo || {}) },
      { role: "user", content: "说一句简短的自我介绍。" },
    ])
      .then((r) => !!r?.tolk)
      .catch(() => false);
  }

  generateOnce(promptType, contextData, petInfo) {
    const apiKey = getSys("llmApiKey");
    if (!apiKey || !getSys("llmEnabled")) return Promise.resolve(null);
    const builder = DYNAMIC_PROMPTS[promptType];
    const userPrompt = builder
      ? builder(contextData)
      : USER_PROMPTS[promptType];
    if (!userPrompt) return Promise.resolve(null);
    return callDeepSeek(apiKey, [
      { role: "system", content: SYSTEM_PROMPT(petInfo) },
      { role: "user", content: userPrompt },
    ])
      .then((r) => (r?.tolk ? r : null))
      .catch(() => null);
  }
}

global.llmService = new LLMService();
global.LLM_MAX_CLIPBOARD_LEN = MAX_CLIPBOARD_LEN;
module.exports = {};
