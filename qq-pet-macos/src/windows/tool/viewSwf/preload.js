const { contextBridge, ipcRenderer } = require('electron')
let main_html = {
  // 主程序给html 文件操作状态
  viewSwf_busState: (event) => ipcRenderer.on('viewSwf_bus-state', event),
  // 主程序给html 附近路径
  viewSwf_busFolder: (event) => ipcRenderer.on('viewSwf_bus-folder', event),
}
let html_main = {
  // html给主程序  需要处理的文件
  viewSwf_setFileNames: (event) => ipcRenderer.send('viewSwf_set-file', event),
  // html给主程序  获取附近路径
  viewSwf_getFolder: (event) => ipcRenderer.send('viewSwf_get-folder', event),
}

window.electronAPI = Object.assign(window.electronAPI || {}, {
  // 控制台打印
  viewSwf_setSay: (say) => ipcRenderer.send('viewSwf_set-say', say),
  // 主程序给html
  viewSwf_ToHtml: (event) => ipcRenderer.on('viewSwf_bus-html', event),
  // html给主程序
  viewSwf_ToMain: (event) => ipcRenderer.send('viewSwf_bus-Main', event),
  ...main_html,
  ...html_main
})