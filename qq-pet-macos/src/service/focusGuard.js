const _require = eval("require");
const { powerMonitor } = _require("electron");

const TICK_INTERVAL_MS = 30 * 1000;
const ACTIVE_THRESHOLD_SEC = 60;

const DEFAULTS = {
  focusEyeMin: 25,
  focusEyeCooldownMin: 20,
  sedentaryMin: 50,
  sedentaryCooldownMin: 30,
  lateNightCooldownMin: 60,
  welcomeBackThresholdMin: 15,
  welcomeBackCooldownMin: 30,
  activeResetIdleMin: 5,
  sedentaryResetIdleMin: 10,
};

const FALLBACK_TEXT = {
  focusEye: "主人，眼睛已经盯屏 25 分钟啦，远眺一下吧~",
  sedentary: "主人，坐了好久了，起来活动活动吧！",
  lateNight: "主人，这么晚了，早点睡哦~",
  welcomeBack: "主人回来啦~欢迎欢迎！",
};

class FocusGuard {
  constructor() {
    this.timer = null;
    this.lastIdleSec = 0;
    this.continuousActiveSec = 0;
    this.continuousSedentarySec = 0;
    this.lastReminders = {};
  }

  start() {
    if (this.timer) return;
    this.lastIdleSec = 0;
    this.continuousActiveSec = 0;
    this.continuousSedentarySec = 0;
    this.lastReminders = {};
    this.timer = setInterval(() => {
      try {
        this._tick();
      } catch (e) {}
    }, TICK_INTERVAL_MS);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  _canRemind(type, cooldownSec) {
    const now = Date.now();
    const last = this.lastReminders[type] || 0;
    return now - last >= cooldownSec * 1000;
  }

  _markReminded(type) {
    this.lastReminders[type] = Date.now();
  }

  _tick() {
    if (!getSys("focusEnabled")) return;
    if (typeof powerMonitor?.getSystemIdleTime !== "function") return;
    if (typeof openSpeak !== "function") return;

    const idleSec = powerMonitor.getSystemIdleTime();
    const isActive = idleSec < ACTIVE_THRESHOLD_SEC;
    const wasActive = this.lastIdleSec < ACTIVE_THRESHOLD_SEC;
    const tickSec = TICK_INTERVAL_MS / 1000;

    if (isActive) {
      if (!wasActive) {
        const awaySec = this.lastIdleSec;
        if (awaySec > DEFAULTS.activeResetIdleMin * 60) {
          this.continuousActiveSec = 0;
        }
        if (awaySec > DEFAULTS.sedentaryResetIdleMin * 60) {
          this.continuousSedentarySec = 0;
        }
        if (
          awaySec > DEFAULTS.welcomeBackThresholdMin * 60 &&
          getSys("focusWelcomeBack") &&
          this._canRemind(
            "welcomeBack",
            DEFAULTS.welcomeBackCooldownMin * 60
          )
        ) {
          this._fireReminder("welcomeBack", {
            awayMin: Math.floor(awaySec / 60),
          });
        }
      }
      this.continuousActiveSec += tickSec;
      this.continuousSedentarySec += tickSec;

      if (
        getSys("focusEyeReminder") &&
        this.continuousActiveSec >= DEFAULTS.focusEyeMin * 60 &&
        this._canRemind("focusEye", DEFAULTS.focusEyeCooldownMin * 60)
      ) {
        this._fireReminder("focusEye", {
          activeMin: Math.floor(this.continuousActiveSec / 60),
        });
        this.continuousActiveSec = 0;
      }

      if (
        getSys("focusSedentaryReminder") &&
        this.continuousSedentarySec >= DEFAULTS.sedentaryMin * 60 &&
        this._canRemind("sedentary", DEFAULTS.sedentaryCooldownMin * 60)
      ) {
        this._fireReminder("sedentary", {
          sedentaryMin: Math.floor(this.continuousSedentarySec / 60),
        });
        this.continuousSedentarySec = 0;
      }

      const hour = new Date().getHours();
      if (
        getSys("focusLateNightReminder") &&
        (hour >= 22 || hour < 4) &&
        this._canRemind("lateNight", DEFAULTS.lateNightCooldownMin * 60)
      ) {
        this._fireReminder("lateNight", { hour });
      }
    } else {
      if (idleSec > DEFAULTS.activeResetIdleMin * 60) {
        this.continuousActiveSec = 0;
      }
      if (idleSec > DEFAULTS.sedentaryResetIdleMin * 60) {
        this.continuousSedentarySec = 0;
      }
    }

    this.lastIdleSec = idleSec;
  }

  _fireReminder(type, ctx) {
    this._markReminded(type);

    const useLLM =
      typeof llmService !== "undefined" &&
      getSys("llmEnabled") &&
      getSys("llmApiKey");

    const showFallback = () => {
      const txt = FALLBACK_TEXT[type] || "主人~";
      openSpeak({
        data: { type: "text", data: txt, submitText: "好的" },
        nextActiveStr: "speak",
      });
    };

    if (!useLLM) {
      showFallback();
      return;
    }

    let petInfo = {};
    try {
      petInfo = typeof getPetInfo === "function" ? getPetInfo() : {};
    } catch (e) {}

    llmService
      .generateOnce(type, ctx, petInfo)
      .then((r) => {
        if (r?.tolk) {
          openSpeak({
            data: {
              type: "text",
              data: r.tolk,
              submitText: r.submitText || "好的",
            },
            nextActiveStr: "speak",
          });
        } else {
          showFallback();
        }
      })
      .catch(() => showFallback());
  }
}

global.focusGuard = new FocusGuard();
module.exports = {};
