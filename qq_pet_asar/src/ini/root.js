const _require = eval("require");
// 本机无法进行js与flash交互有安全机制问题， 通过开端口形式进行flash页面引入
const createMain = (fn, post, ip, fileName, none) => {
  if (none) {
    fn(post, ip, fileName);
    return;
  }
  const express = _require("express");
  const app = express();
  const path = _require("path");
  app.get("/", function (req, res) {
    // res.render('index');
    res.send("this is the Homepage");
  });
  // fileName = 'u'
  let pattt = path.join(__dirname, "../../src");
  app.use("/" + fileName, express.static(pattt));
  let aotuIp = getLocalIP();
  var server = app.listen(post, ip || aotuIp[0], function () {
    var host = server.address().address;
    var port = server.address().port;
    fn(port, host, fileName);
    console.log("express at http://%s:%s/%s", host, port, fileName);
  });
};

let device = {};
//本机websocket
const openWS = (wsPopt) => {
  let ws = _require("nodejs-websocket");
  let server = ws.createServer(function (conn) {
    conn.on("text", async function (data) {
      // 接受客户端消息 并处理
      //重写发送消息事件
      conn.sendTextJson = (option) => {
        try {
          option = JSON.stringify(option);
        } catch (error) {}
        conn.sendText(option);
      };
      try {
        data = JSON.parse(data);
      } catch (e) {}
      if (data.router == "joinDevice") {
        device[data.name] = conn;
      }
      if (data.router == "setMsg") {
        device[data.name].sendTextJson(data.data);
      }
    });
    conn.on("close", function (code, reason) {
      //code = 1001 reason= “”
    });
    conn.on("error", function (code, reason) {
      //code= 报错信息，reason = undefined
    });
  });
  server.listen(wsPopt, function () {
    console.log("websocket：" + wsPopt);
  });
};

function getLocalIP(fn) {
  const os = _require("os");
  const osType = os.type(); //系统类型
  const netInfo = os.networkInterfaces(); //网络信息
  let ip = [];
  let str = `请选择启动ip`;
  if (osType === "Windows_NT") {
    let i = 0;
    for (let dev in netInfo) {
      //win7的网络信息中显示为本地连接，win10显示为以太网
      // if (dev === '本地连接' || dev === '以太网') {
      for (let j = 0; j < netInfo[dev].length; j++) {
        if (netInfo[dev][j].family === "IPv4") {
          // ip = netInfo[dev][j].address;
          ip.push(netInfo[dev][j].address);
          str += `
第${i++}个IP：${netInfo[dev][j].address}`;
        }
      }
      // }
    }
  } else if (osType === "Linux") {
    ip = netInfo.eth0[0].address;
  } else if (osType === "Darwin") {
    // mac操作系统
    // ip = netInfo.eth0[0].address;
  } else {
    // 其他操作系统
  }
  // let chouseIpFn = () => {
  // 	const readline = _require('readline').createInterface({
  // 		input: process.stdin,
  // 		output: process.stdout,
  // 	});
  // 	readline.question(`${str}
  // 	`, name => {
  // 		let chouseIp = ip[name]
  // 		if (chouseIp) {
  // 			console.log('已选择： ' + chouseIp)
  // 			fn && fn(chouseIp)
  // 			readline.close();
  // 		} else {
  // 			console.log('请选择正确选项')
  // 			readline.close();
  // 			chouseIpFn()
  // 		}
  // 	});
  // }
  // chouseIpFn()
  return ip;
}

try {
  if (module) module.exports = { openWS, createMain };
} catch (error) {}
/**
 * 
sad
var mx:int = this.mouseX;
         var my:int = this.mouseY;
         ExternalInterface.call("API.GetCursorPositionHtml",mx,my);
         if(mx < -30)
         {
            mx = 34;
         }
         if(my < -79)
         {
            my = 0;
         }
         return new Point(mx,my);
happy peaceful
var mx:int = this.mouseX;
         var my:int = this.mouseY;
         ExternalInterface.call("API.GetCursorPositionHtml",mx,my);
         if(mx < -70)
         {
            mx = 0;
         }
         if(my < -70)
         {
            my = 0;
         }
         return new Point(mx,my);

prostrate
var mx:int = this.mouseX;
         var my:int = this.mouseY;
         ExternalInterface.call("API.GetCursorPositionHtml",mx,my);
         if(mx < -33)
         {
            mx = 35;
         }
         if(my < -83)
         {
            my = 21;
         }
         return new Point(mx,my);
upset
var mx:int = this.mouseX;
         var my:int = this.mouseY;
         ExternalInterface.call("API.GetCursorPositionHtml",mx,my);
         if(mx < -38)
         {
            mx = 29;
         }
         if(my < -68)
         {
            my = 24;
         }
         return new Point(mx,my);

 */

let fileNames = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "_",
];

let url = {
  host: "",
  port: "",
  fileName: "",
};
global.openLocalHost = (fn) => {
  if (!fn) {
    return;
  }
  if (url.host) {
    fn(url);
    return;
  }
  const express = _require("express");
  const app = express();
  const path = _require("path");
  app.get("/", function (req, res) {
    // res.render('index');
    res.send("this is the Homepage");
  });
  let fileName = upDownArr(shuffleArr(fileNames)).join("");
  // fileName = 'u'
  let pattt = path.join(__dirname, "../../src");
  app.use("/" + fileName, express.static(pattt));
  let aotuIp = getLocalIP();
  let post = "33385";
  var server = app.listen(post, aotuIp[0], function () {
    var host = server.address().address;
    var port = server.address().port;
    url = {
      host: host,
      port: port,
      fileName: fileName,
    };
    fn(url);
    console.log("express at http://%s:%s/%s", host, port, fileName);
  });
};
