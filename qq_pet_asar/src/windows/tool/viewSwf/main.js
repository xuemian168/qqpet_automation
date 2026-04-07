const path = require("path");
// const icon = path.join(__dirname, '../../../assets/icons.png')
const icon = path.join(__dirname, "../../../assets/floatStyle.png");
const { app } = require("electron");
// const userApi = require('../../service/viewSwf/user')
const { doFiles, getAllFolder, reFileNames } = require("../../util/file.js");
class mainClass {
  constructor(arg) {
    this.window = null;
    this.show = false;
    this.name = "viewSwf";
  }
  cleate(msg) {
    msg = typeof msg == "string" ? msg : JSON.stringify(msg);
    this.width = 750;
    this.height = 680;
    let _this = this;
    windowsMain
      .open({
        name: this.name,
        loadFile: "tool/" + this.name,
        jsFiles: [
          "./lib/ant-design/dayjs.min.js",
          "./lib/ant-design/customParseFormat.js",
          "./lib/ant-design/localeData.js",
          "./lib/ant-design/weekday.js",
          "./lib/ant-design/weekOfYear.js",
          "./lib/ant-design/weekYear.js",
          "./lib/ant-design/advancedFormat.js",
          //   "./lib/ant-design/antd.min.js",
        ],
        jsFilesAfter: ["./lib/ant-design/antd.min.js"],
        cssFiles: [],
        default: {
          width: this.width,
          height: this.height,
          frame: false, //去掉边框
          transparent: true, //透明底图
          resizable: false,
          //   openDevTools: true, //打开调试
          icon: icon,
          // skipTaskbar: true,//任务栏图标隐藏
          // alwaysOnTop: true,//置顶
          //   webPreferences: {
          //     plugins: true,
          //     nodeIntegration: true, //设置能在页面使用nodejs的API
          //     contextIsolation: true, // 上下文隔离
          //     //backgroundThrottling: false,   //设置应用在后台正常运行
          //     // preload: path.join(__dirname, './preload.js') //暴露给方法
          //   },
        },
        //所有在主程序的生命周期都快于vue中以及html的生命周期
        created(backVm) {
          let { vm, preloads, getinfo, wsMethods } = backVm;
          // vm.openDevTools({ mode: 'undocked' })
          // console.log(getMachineId(), 'getMachineId')
          // console.log(getToken(), 'getToken')
          // console.log(getUserInfo(), 'getUserInfo')
          // console.log(getPetInfo(), 'getPetInfo')
          preloads({
            "viewSwf_set-say": (event, say) => {
              console.log(say, " --- html say");
            },
            "viewSwf_bus-Main": (event, val) => {
              if (val.event == "mounted") {
                //监听内部mounted生命周期 并执行初始化方法
                vm.webContents.send("viewSwf_bus-html", {
                  data: "load",
                  type: "load",
                });
              } else if (val.event == "close") {
                // vm.close();
                _this.doClose();
              }
            },
            "viewSwf_set-file": (event, files) => {
              // console.log(files, ' --- html file')
              let file = files.files;
              try {
                file = JSON.parse(file);
              } catch (error) {}
              if (files.event == "move" || files.event == "copy") {
                doFiles(file, files.toPath, files.event, (e) => {
                  vm.webContents.send("viewSwf_bus-state", {
                    type: "backState",
                    data: e,
                  });
                });
              }
              if (files.event == "reName") {
                reFileNames(file, (e) => {
                  vm.webContents.send("viewSwf_bus-state", {
                    type: "reName",
                    data: e,
                  });
                });
              }
            },
            "viewSwf_get-folder": (event, val) => {
              getAllFolder(val.path, (routers) => {
                vm.webContents.send("viewSwf_bus-folder", {
                  type: "folders",
                  data: routers,
                });
              });
            },
          });

          // // 设置ws 信息路由回调 // 需要在页面加载完成后加入 保证页面可以正常接受到信息 并做处理
          // let addWsMethod = () => {
          //     wsMethods([{
          //         router: 'online',
          //         winName: this.name,
          //         fn: (data) => {
          //             console.log(data, 456)
          //             if (data.type == 'oldWsMsg') {
          //                 data = data.data
          //             }
          //             vm.webContents.send('chatWindow_bus-html_body', { data: data, type: 'friends' })
          //         }
          //     }])
          // }
        },
        onload() {
          // console.log('onload ',this.name)
        },
        onshow() {
          // console.log('onshow ',this.name)
          _this.show = true;
        },
        onhide() {
          // console.log('onhide ',this.name)
          _this.show = false;
        },
        onclose() {
          // console.log('onclose ',this.name)
        },
      })
      .then((dom) => {
        this.window = dom;
        this.init();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  init() {
    this.show = true;
  }
  doClose() {
    this.window.close();
    this.show = false;
  }
}
let main = new mainClass();
module.exports = main;
