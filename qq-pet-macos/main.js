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
];

// Windows: Electron 32+ 的 CalculateNativeWinOcclusion 会把 frameless+transparent
// 桌宠窗口误判为被遮挡而停止合成，issue #10 复现的"窗口不显示"。
if (process.platform === "win32") {
  disabledFeatures.push("CalculateNativeWinOcclusion");
}

app.commandLine.appendSwitch("disable-features", disabledFeatures.join(","));

// V8 堆上限：renderer 也会继承该 switch，过紧会让 Ruffle/SWF 加载阶段 OOM 静默崩
// (issue #10)。给 renderer 留出加载 200MB SWF + Ruffle WASM 的空间。
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=512");

// 内存压力下更激进地回收
app.commandLine.appendSwitch("enable-features", "MemoryPressureBasedSourceBufferGC");

app.whenReady().then(() => {
  createWindow();
});
