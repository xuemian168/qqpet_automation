const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const RELOAD_DELAY = 250;

function startDataWatcher() {
  const filePath = path.join(app.getPath("userData"), "config-macos.json");

  if (!fs.existsSync(filePath)) {
    return;
  }

  let debounceTimer = null;
  let watcher = null;

  const reload = () => {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.pet && typeof global.setPetInfo === "function") {
        global.setPetInfo(data.pet);
      }
      if (data.cache && typeof global.setCache === "function") {
        global.setCache({ init: data.cache });
      }
      if (data.sys && typeof global.setSys === "function") {
        global.setSys({ init: data.sys });
      }
    } catch (err) {
      // 半写入 / 解析失败 —— 下一次 watch 事件会再次触发
    }
  };

  const scheduleReload = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(reload, RELOAD_DELAY);
  };

  try {
    watcher = fs.watch(filePath, { persistent: false }, scheduleReload);
  } catch (err) {
    return;
  }

  watcher.on("error", () => {});

  app.on("before-quit", () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    try {
      watcher && watcher.close();
    } catch (_) {}
  });
}

module.exports = { startDataWatcher };
