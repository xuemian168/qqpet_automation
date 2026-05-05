// macOS: 全局 EPIPE 防护 — 必须在最前面
// 原项目有几百个 console.log，管道断开时会 EPIPE 崩溃
const _origLog = console.log;
const _origErr = console.error;
const _origWarn = console.warn;
const safeFn = (fn) => (...args) => { try { fn(...args); } catch (e) { if (e?.code !== "EPIPE") throw e; } };
console.log = safeFn(_origLog);
console.error = safeFn(_origErr);
console.warn = safeFn(_origWarn);
process.stdout?.on?.("error", () => {});
process.stderr?.on?.("error", () => {});
process.on("uncaughtException", (err) => {
  if (err.code === "EPIPE" || err.message?.includes("EPIPE")) return;
});

const { app } = require("electron");
const path = require("path");

const gotTheLock = app.requestSingleInstanceLock();

// 禁用测试后门
global.$test = false;

global.initData = {};

let useTool = null;
let tool = ["floatStyle"];

try {
  let e = process.argv;
  for (let t in tool) {
    let a = false;
    for (let o in e) {
      if (e[o].indexOf(tool[t]) !== -1) {
        initData.NODE_TOOL = tool[t];
        a = true;
        break;
      }
    }
    if (a) break;
  }
} catch (e) {}

if (process?.env?.NODE_TOOL) {
  initData.NODE_TOOL = process.env.NODE_TOOL;
}

if (initData?.NODE_TOOL && typeof initData?.NODE_TOOL === "string") {
  useTool = require("./src/windows/tool/" + initData.NODE_TOOL + "/main.js");
}

const createWindow = async () => {
  require("./src/ini/init.js");
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
  process.on("unhandledRejection", function (e, t) {});
  app.setAppUserModelId("pet");

  if (gotTheLock) {
    if (useTool) {
      useTool.cleate("only");
    } else {
      require("./src/ini/doMain.js");
      const { startDataWatcher } = require("./src/ini/dataWatcher.js");
      startDataWatcher();
    }
  } else {
    app.exit(true);
  }
};

// macOS: 不加载 PepFlash DLL（使用 Ruffle WASM 替代）
app.commandLine.appendSwitch("disable-site-isolation-trials");

// Windows: RDP / 终端服务会话下 GPU 合成不可用，transparent+frameless
// 桌宠窗口会完全不渲染（issue #10 在远程桌面环境下的根因）。
// 检测到远程会话时退化为 CPU 软件合成。
if (process.platform === "win32") {
  const sess = (process.env.SESSIONNAME || "").toUpperCase();
  const isRemoteSession = sess.startsWith("RDP-") || !!process.env.CLIENTNAME;
  if (isRemoteSession) {
    app.disableHardwareAcceleration();
    app.commandLine.appendSwitch("disable-gpu");
    app.commandLine.appendSwitch("disable-gpu-compositing");
  }
}

// 内存优化：禁用桌宠用不到的 Chromium 子系统
const disabledFeatures = [
  "HardwareMediaKeyHandling",
  "GlobalMediaControls",
  "MediaRouter",
  "DialMediaRouteProvider",
  "Translate",
  "OptimizationHints",
  "MediaSessionService",
  "AcceptCHFrame",
  "AutofillServerCommunication",
  "CertificateTransparencyComponentUpdater",
  // WASM trap handler 在 Windows 虚机/部分宿主上注册失败时，WASM trap 会
  // 直接触发 SIGSEGV 让 renderer 整进程崩（issue #10 中 Ruffle 加载 SWF
  // 时复现 reason=crashed exitCode=-36861）。改走软件路径。
  "WebAssemblyTrapHandler",
];

// Windows: Electron 32+ 的 CalculateNativeWinOcclusion 会把 frameless+transparent
// 桌宠窗口误判为被遮挡而停止合成，issue #10 复现的"窗口不显示"。
if (process.platform === "win32") {
  disabledFeatures.push("CalculateNativeWinOcclusion");
}

app.commandLine.appendSwitch("disable-features", disabledFeatures.join(","));

// 内存压力下更激进地回收
app.commandLine.appendSwitch("enable-features", "MemoryPressureBasedSourceBufferGC");

// V8 层同步禁用 WASM trap handler（与上面 Chromium feature 双保险）
app.commandLine.appendSwitch("js-flags", "--no-wasm-trap-handler");

// renderer crash 诊断：把崩溃原因打到 stdout，便于 issue 报告时定位
// （V8 OOM / SIGSEGV 等不会走 console，仅这里能看到）
app.on("render-process-gone", (event, webContents, details) => {
  try {
    const url = webContents?.getURL?.() || "?";
    console.error(`[RENDERER-GONE] reason=${details.reason} exitCode=${details.exitCode} url=${url}`);
  } catch (_) {}
});
app.on("child-process-gone", (event, details) => {
  try {
    console.error(`[CHILD-GONE] type=${details.type} reason=${details.reason} exitCode=${details.exitCode}`);
  } catch (_) {}
});

app.whenReady().then(() => {
  createWindow();
});
