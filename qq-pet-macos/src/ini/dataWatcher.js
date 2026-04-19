const fs = require("fs");
const path = require("path");
const { app } = require("electron");

// macOS 下原子写（tmp + rename）会更换 inode，fs.watch(file) 监听旧 inode 会失效；
// 改为监听父目录，在回调里按文件名过滤。
//
// pet.js 的 setPetInfo 对 activeValue / fishing / otherOptions 用 `!=` 比较对象引用，
// JSON.parse 每次产生新对象，即使值相等也会被判定为"变更"触发 $Store.setItem 回写，
// 从而形成无限反馈循环。应对策略：
//   1) 只把 info / maxInfo / activeOption（基本都是原始类型或 null）传入 setPetInfo；
//   2) 用 lastRaw 去重整体文件内容；
//   3) setPetInfo 结束后重新读一次磁盘，把 Electron 自己的回写纳入 lastRaw，
//      防止下一次 watch 事件回源触发。
function startDataWatcher() {
  const dir = app.getPath("userData");
  const fileName = "config-macos.json";
  const filePath = path.join(dir, fileName);

  let watcher = null;
  let lastRaw = "";

  const readFile = () => {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch (_) {
      return "";
    }
  };

  const reload = () => {
    const raw = readFile();
    if (!raw || raw === lastRaw) return;

    let data;
    try {
      data = JSON.parse(raw);
    } catch (_) {
      return;
    }

    lastRaw = raw;

    const pet = (data && data.pet) || {};
    const payload = {};
    if (pet.info) payload.info = pet.info;
    if (pet.maxInfo) payload.maxInfo = pet.maxInfo;
    if (pet.activeOption) payload.activeOption = pet.activeOption;

    if (typeof global.setPetInfo === "function" && Object.keys(payload).length) {
      global.setPetInfo(payload);
      // setPetInfo 会触发 Electron 自己的 $Store.setItem 回写文件，刷新 lastRaw
      // 以免下一次 watch 事件把这次的"回写"重新当作外部变更处理。
      lastRaw = readFile() || lastRaw;
    }
  };

  try {
    watcher = fs.watch(dir, { persistent: false }, (_eventType, changedName) => {
      if (changedName && changedName !== fileName) return;
      reload();
    });
  } catch (_) {
    return;
  }

  watcher.on("error", () => {});

  // 初始化 lastRaw 为启动时的磁盘内容，避免启动阶段误触发。
  lastRaw = readFile();

  app.on("before-quit", () => {
    try {
      watcher && watcher.close();
    } catch (_) {}
  });
}

module.exports = { startDataWatcher };
