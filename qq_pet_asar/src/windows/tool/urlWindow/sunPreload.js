const _require = eval("require");

const { contextBridge, ipcRenderer } = _require("electron");
let main_html = {
  // 主程序给html  pet 信息 实时更新
  // urlWindowSun_m_bus: (event) => ipcRenderer.on('urlWindowSun_m_bus_h', event),
};
let html_main = {
  // html给主程序  pet 移动位置
  // urlWindowSun_h_bus: (event) => ipcRenderer.send('urlWindowSun_h_bus_m', event),
};

contextBridge.exposeInMainWorld("electronAPI", {
  // 控制台打印
  urlWindowSun_h_say: (say) => ipcRenderer.send("urlWindowSun_h_say_m", say),
  // 主程序给html
  urlWindowSun_m_bus: (event) => ipcRenderer.on("urlWindowSun_m_bus_h", event),
  // html给主程序
  urlWindowSun_h_bus: (event) => ipcRenderer.send("urlWindowSun_h_bus_m", event),
  ...main_html,
  ...html_main,
});
