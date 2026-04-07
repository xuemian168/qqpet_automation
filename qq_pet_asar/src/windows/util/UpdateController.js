const _require = eval("require");
const { autoUpdater, CancellationToken } = _require("electron-updater");
let cancellationTokenUse = null;
// const { ipcMain, app } = _require("electron");
const { getPetConfig } = _require("../../service/model/user");
let ff = null,
  updateUrl = "",
  loadUrl = false;
const getUpUrl = (fn) => {
  if (loadUrl) return;
  loadUrl = true;
  getPetConfig()
    .then((res) => {
      updateUrl = res?.updateUrl || "";
      checkUpdate(fn);
      loadUrl = false;
    })
    .catch((err) => {
      console.log("err", err);
      updateUrl = "";
      loadUrl = false;
    });
};
const checkUpdate = (fn) => {
  if (!updateUrl) {
    getUpUrl(fn);
    return;
  }
  if (global.UpdateChecking || global.UpdateDowning) {
    ff && ff({ type: "not", msg: "[host]，别点了，我在忙~~" });
    return;
  }
  global.UpdateChecking = true;
  ff = fn;
  console.log("updateUrl", updateUrl);
  autoUpdater.setFeedURL(
    // "https://raw.gitcode.com/hacker12syy/qPetAssets/raw/main/updater/"
    // "https://shuyangai.online/WorldApi/uploads/qPet/"
    updateUrl
  );
  // ff && ff("tttt new ");
  // autoUpdater.forceDevUpdateConfig = true; //开发环境下强制更新
  autoUpdater.autoDownload = false; // 自动下载
  // autoUpdater.autoInstallOnAppQuit = true; // 应用退出后自动安装
  autoUpdater.on("update-available", (info) => {
    ff &&
      ff({
        type: "up",
        info,
        fn: () => {
          global.UpdateDowning = true;
          cancellationTokenUse = new CancellationToken();
          autoUpdater.downloadUpdate(cancellationTokenUse);
        },
      });
    console.log("have new", info);
    global.ChangeHaveUpdate(true);
    // judgeRs = {
    //   success: true,
    //   needUpdate: true,
    //   msg: "有新版本需要更新",
    //   version: info.version,
    // };
  });
  // 检测更新查询异常
  autoUpdater.on("error", function (error) {
    console.log("error", error);
    global.ChangeHaveUpdate(false);
    global.UpdateDowning = false;
    ff && ff({ type: "not", msg: "下载出错请重试~" });
    // sendUpdateMessage(mainWindow, message.error);
  });
  autoUpdater.on("update-not-available", (info) => {
    global.ChangeHaveUpdate(false);
    // ff && ff("none new ");
    console.log("none new");
    ff && ff({ type: "not" });
  });

  autoUpdater.on("download-progress", (prog) => {
    if (!global.UpdateDowning) return;
    let speed =
      prog.bytesPerSecond / 1000000 > 1
        ? Math.ceil(prog.bytesPerSecond / 1000000) + "M/s"
        : Math.ceil(prog.bytesPerSecond / 1000) + "K/s";
    let sc = {
      speed, // 网速
      percent: Math.ceil(prog.percent), // 百分比
    };
    // console.log(sc);
    ff &&
      ff({
        type: "sc",
        sc,
        fn: () => {
          global.UpdateDowning = false;
          cancellationTokenUse.cancel();
        },
      });
  });
  autoUpdater.on("update-downloaded", (info) => {
    // 下载完成后强制用户安装，不推荐
    UpdateDowning = false;
    ff &&
      ff({
        type: "down",
        fn: () => {
          autoUpdater.quitAndInstall();
        },
      });
    // autoUpdater.quitAndInstall();
  });

  // autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.checkForUpdates();
};

module.exports = checkUpdate;
