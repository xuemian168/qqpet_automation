let saveOpt = {},
  saveTime = null;
// 设置键值对到 Cookie 中，过期时间为 1 年
function setCookie(key, value, save) {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1); // 设置 1 年后为过期时间
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
    value
  )};expires=${now.toUTCString()};path=/`;
  if (save) {
    //进行保存调用
    if (saveTime) {
      clearTimeout(saveTime);
    }
    //加入需要保存的数据
    saveOpt[key] = value + "";
    saveTime = setTimeout(() => {
      console.log("saveOpt", saveOpt);
      if (!saveInfoData) {
        return;
      }
      // 保存
      saveInfoData && saveInfoData(JSON.parse(JSON.stringify(saveOpt)));
      saveOpt = {};
    }, 500);
  }
}

// 从 Cookie 中读取键值对
function getCookie(key) {
  const cookies = document.cookie.split("; "); // 分割 Cookie 字符串为键值对数组
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.split("="); // 分割键和值
    if (decodeURIComponent(cookieKey) === key) {
      // setCookie(key, decodeURIComponent(cookieValue)); // 更新过期时间
      return decodeURIComponent(cookieValue); // 返回解码后的值
    }
  }
  return null; // 如果找不到键，返回 null
}
let oneHour = 60 * 60;
window.alert = (e) => {
  console.log("alert", e);
  if (e == "暂不支持一键收获！") {
    console.log("一键收获");
    //一键收获
    let ResultData = {
      data: {},
      head: {
        cmd: 8,
        game: 6,
        key: "",
        svr: 0,
        ver: 1,
      },
    };
    window.PETSendData(JSON.stringify(ResultData));
  }
};
var maxId = 0;

var shop1 = [
  //缺省值 growth:, wuli:, zhili:, meili:, limit_num:
  {
    fryid: 1,
    avator: 1,
    flag: 0,
    name: "秋刀鱼",
    level: 1,
    price_yb: 4,
    quantity: 5,
    interval: 3600,
    sell_price: 1,
  },
  {
    fryid: 2,
    avator: 2,
    flag: 0,
    name: "金鱼",
    level: 0,
    price_yb: 2,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 1,
  },
  {
    fryid: 3,
    avator: 3,
    flag: 0,
    name: "热带鱼",
    level: 2,
    price_yb: 4,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 2,
  },
  // {
  //   fryid: 4,
  //   avator: 4,
  //   flag: 1,
  //   name: "鳝鱼",
  //   level: 3,
  //   price_yb: 6,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 3,
  // },
  // {
  //   fryid: 5,
  //   avator: 5,
  //   flag: 1,
  //   name: "刺须鲶鱼",
  //   level: 4,
  //   price_yb: 8,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 4,
  // },
  // {
  //   fryid: 6,
  //   avator: 6,
  //   flag: 1,
  //   name: "紫印鱼",
  //   level: 5,
  //   price_yb: 10,
  //   quantity: 5,
  //   interval: 6 * 3600,
  //   sell_price: 5,
  // },
  // {
  //   fryid: 7,
  //   avator: 7,
  //   flag: 1,
  //   name: "水母",
  //   level: 0,
  //   qbFlag: 1,
  //   price_qb: 5,
  //   quantity: 10,
  //   interval: 4 * 3600,
  //   sell_price: 100,
  // },
  {
    fryid: 8,
    avator: 8,
    flag: 0,
    name: "大眼鱼",
    level: 8,
    price_yb: 16,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 7,
  },
  {
    fryid: 9,
    avator: 9,
    flag: 0,
    name: "孔雀鱼",
    level: 10,
    price_yb: 18,
    quantity: 5,
    interval: 6 * 360,
    sell_price: 9,
  },
  // {
  //   fryid: 10,
  //   avator: 10,
  //   flag: 1,
  //   name: "河豚",
  //   level: 0,
  //   qbFlag: 1,
  //   price_qb: 1,
  //   quantity: 10,
  //   interval: 4 * 3600,
  //   sell_price: 20,
  // },
  {
    fryid: 11,
    avator: 11,
    flag: 0,
    name: "虎皮鱼",
    level: 14,
    price_yb: 40,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 10,
  },
  // {
  //   fryid: 12,
  //   avator: 12,
  //   flag: 1,
  //   name: "蓝晶鱼",
  //   level: 0,
  //   qbFlag: 1,
  //   price_qb: 2,
  //   quantity: 10,
  //   interval: 4 * 3600,
  //   sell_price: 40,
  // },
  {
    fryid: 13,
    avator: 13,
    flag: 0,
    name: "闪电鱼",
    level: 18,
    price_yb: 40,
    quantity: 5,
    interval: 6 * 3600,
    sell_price: 13,
  },
  // {
  //   fryid: 14,
  //   avator: 14,
  //   flag: 1,
  //   name: "天使鱼",
  //   level: 20,
  //   price_yb: 50,
  //   quantity: 5,
  //   interval: 6 * 3600,
  //   sell_price: 12,
  // },
  // {
  //   fryid: 15,
  //   avator: 15,
  //   flag: 1,
  //   name: "剑鱼",
  //   level: 12,
  //   price_yb: 27,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 9,
  // },
  {
    fryid: 16,
    avator: 16,
    flag: 0,
    name: "石斑鱼",
    level: 16,
    price_yb: 32,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 11,
  },
  {
    fryid: 17,
    avator: 17,
    flag: 0,
    name: "灯泡鱼",
    level: 6,
    price_yb: 13,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 6,
  },
  // {
  //   fryid: 18,
  //   avator: 18,
  //   flag: 1,
  //   name: "小丑鱼",
  //   level: 0,
  //   price_yb: 13,
  //   quantity: 10,
  //   interval: 4 * 3600,
  //   sell_price: 3,
  // },
  // {
  //   fryid: 19,
  //   avator: 19,
  //   flag: 1,
  //   name: "鳕鱼",
  //   level: 10,
  //   price_yb: 40,
  //   quantity: 10,
  //   interval: 4 * 3600,
  //   sell_price: 6,
  // },
  // {
  //   fryid: 20,
  //   avator: 20,
  //   flag: 1,
  //   name: "小龙虾",
  //   level: 20,
  //   price_yb: 30,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 33,
  // },
  // {
  //   fryid: 21,
  //   avator: 21,
  //   flag: 1,
  //   name: "凤尾鱼",
  //   level: 20,
  //   price_yb: 30,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 35,
  // },
  // {
  //   fryid: 22,
  //   avator: 22,
  //   flag: 1,
  //   name: "娃娃鱼",
  //   level: 15,
  //   price_yb: 28,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 38,
  // },
  // {
  //   fryid: 23,
  //   avator: 23,
  //   flag: 1,
  //   name: "大丽红尾鱼",
  //   level: 34,
  //   price_yb: 81,
  //   quantity: 5,
  //   interval: 8 * 3600,
  //   sell_price: 32,
  // },
  // {
  //   fryid: 28,
  //   avator: 28,
  //   flag: 1,
  //   name: "玉顶狮子鱼",
  //   level: 20,
  //   price_yb: 30,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 40,
  // },
  // {
  //   fryid: 29,
  //   avator: 29,
  //   flag: 1,
  //   name: "螃蟹",
  //   level: 16,
  //   price_yb: 28,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 33,
  // },
  // {
  //   fryid: 30,
  //   avator: 30,
  //   flag: 1,
  //   name: "果冻鱼",
  //   level: 0,
  //   qbFlag: 1,
  //   price_qb: 1,
  //   quantity: 5,
  //   interval: 8 * 3600,
  //   sell_price: 45,
  // },
  // {
  //   fryid: 31,
  //   avator: 31,
  //   flag: 1,
  //   name: "五色鱼",
  //   level: 50,
  //   price_yb: 120,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 60,
  // },
  // {
  //   fryid: 32,
  //   avator: 32,
  //   flag: 1,
  //   name: "霸王鱼",
  //   level: 55,
  //   price_yb: 140,
  //   quantity: 5,
  //   interval: 4 * 3600,
  //   sell_price: 80,
  // },
  {
    //鳝鱼
    fryid: 33,
    avator: 33,
    flag: 0,
    name: "章鱼",
    level: 1,
    price_yb: 10,
    quantity: 5,
    interval: 1 * 3500,
    sell_price: 5,
  },
  {
    // 刺须鲢鱼
    fryid: 34,
    avator: 34,
    flag: 0,
    name: "鲟鱼",
    level: 1,
    price_yb: 10,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 5,
  },
];
var shop = [
  {
    fryid: 2,
    avator: 2,
    flag: 0,
    name: "金鱼",
    level: 0,
    price_yb: 2,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 1,
  },
  {
    fryid: 1,
    avator: 1,
    flag: 0,
    name: "秋刀鱼",
    level: 1,
    price_yb: 4,
    quantity: 5,
    interval: 3600,
    sell_price: 1,
  },
  {
    fryid: 3,
    avator: 3,
    flag: 0,
    name: "热带鱼",
    level: 2,
    price_yb: 4,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 2,
  },

  {
    //鳝鱼
    fryid: 33,
    avator: 33,
    flag: 0,
    name: "章鱼",
    level: 3,
    price_yb: 6,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 3,
  },
  {
    // 刺须鲢鱼
    fryid: 34,
    avator: 34,
    flag: 0,
    name: "鲟鱼",
    level: 4,
    price_yb: 8,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 4,
  },

  //鳝鱼 3
  //刺须鲢鱼4
  // 紫印鱼 5
  {
    fryid: 17,
    avator: 17,
    flag: 0,
    name: "灯泡鱼",
    level: 6,
    price_yb: 12,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 6,
  },
  {
    fryid: 8,
    avator: 8,
    flag: 0,
    name: "大眼鱼",
    level: 8,
    price_yb: 16,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 7,
  },
  {
    fryid: 9,
    avator: 9,
    flag: 0,
    name: "孔雀鱼",
    level: 10,
    price_yb: 16,
    quantity: 5,
    interval: 6 * 3600,
    sell_price: 8,
  },
  // 剑鱼 12
  {
    fryid: 13,
    avator: 13,
    flag: 0,
    name: "闪电鱼",
    level: 12,
    price_yb: 18,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 9,
  },
  {
    fryid: 11,
    avator: 11,
    flag: 0,
    name: "虎皮鱼",
    level: 14,
    price_yb: 20,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 10,
  },
  {
    fryid: 16,
    avator: 16,
    flag: 0,
    name: "石斑鱼",
    level: 16,
    price_yb: 25,
    quantity: 5,
    interval: 4 * 3600,
    sell_price: 12,
  },
];
var player;

let i = 0;
const setPETEVENT = (ResultData) => {
  if (i++ > 30) return;
  if (player.PETEventOnReceived) {
    player.PETEventOnReceived(JSON.stringify(ResultData));
  } else {
    setTimeout(() => {
      setPETEVENT(ResultData);
    }, 50);
  }
};

// // window.RufflePlayer = window.RufflePlayer || {};

// // window.RufflePlayer.config = {
// //   allowScriptAccess: true,
// //   autoplay: "on",
// //   unmuteOverlay: "hidden",
// //   backgrounColor: null,
// //   contextMenu: false,
// //   preloader: false,
// //   quality: "best",
// //   warnOnUnsupportedContent: false,
// //   fontSources: ["Yahei.swf"], // load up fonts here
// //   defaultFonts: {
// //     sans: ["微软雅黑"], // then replace them here.
// //   },
// // };
// const

const fishesGroup = (fishes) => {
  //计算当前时间到出生时间的成长值 + 饲料
  if (fishes.stage >= 3) {
    //不进行计算 无法再次成长
    return {
      result: 6,
      msg: "当前🐟儿已成熟~",
      fishes,
    };
  } else {
    //计算成长阶段 总成长值 + 当前阶段饲料
    let gtime =
      Math.floor(Date.now() / 1000) - fishes.born + oneHour * fishes.siLiao;
    if (fishes.interval <= gtime) {
      //计算升一阶段还是2阶段
      let jd = (gtime / fishes.interval) | 0;
      if (jd == 1) {
        fishes.stage = 2;
        fishes.time = gtime - fishes.interval;
      } else {
        fishes.stage = 3;
        fishes.time = 0;
      }
    } else {
      fishes.time = gtime;
      fishes.stage = 1;
    }
  }
  return {
    result: 1,
    msg: "未成熟~",
    fishes,
  };
};

let loadFrist = true;
function setPetInfo(petInfo) {
  if (!loadFrist) {
    setPetInfoAgain(petInfo);
    return;
  } else {
    loadFrist = false;
  }

  //配置成长时间
  if (petInfo.fishing?.fishes?.length) {
    for (let k in petInfo.fishing.fishes) {
      if (+petInfo.fishing.fishes[k].id > maxId) {
        maxId = +petInfo.fishing.fishes[k].id;
      }
      petInfo.fishing.fishes[k] = fishesGroup(petInfo.fishing.fishes[k]).fishes;
    }
  }
  let o1 = petInfo.info.sex === "GG" ? 2 : 3,
    o2 = petInfo.maxInfo.level;
  o2 < 5 ? (o2 = "1") : o2 < 8 ? (o2 = "2") : (o2 = "0");
  let g = "1" + o2 + o1;
  console.log("g", g);

  console.log("iframe petInfo", petInfo);
  setCookie("petname", petInfo.info.name);
  setCookie("username", petInfo.info.host);
  setCookie("gender", g);
  setCookie("yb", petInfo.info.yb); //给定初始元宝
  setCookie("harvestfish", petInfo.fishing.harvestfish); //给定初始收获鱼数
  setCookie("fishes", JSON.stringify(petInfo.fishing.fishes || [])); //给定初始鱼数
  setCookie("level", petInfo.maxInfo.level);
  setCookie("isvip", petInfo.otherOptions.pinkDiamond ? 1 : 0);
  setCookie("vipLv", petInfo.otherOptions.pinkDiamondLevel);
  setCookie("starve", petInfo.info.hunger);
  setCookie("starveMax", petInfo.maxInfo.hunger);
  setCookie("clean", petInfo.info.clean);
  setCookie("cleanMax", petInfo.maxInfo.clean);
  setCookie("allvipcnt", petInfo.fishing.allvipcnt);
  setCookie("canusecnt", petInfo.fishing.canusecnt);
  setCookie("power", petInfo.fishing.power);
  setCookie("needTime", petInfo.fishing.needTime);
  //主动进行数据展示
  let ResultData = {
    data: {
      allvipcnt: petInfo.fishing.allvipcnt, //使用次数提示
      canusecnt: petInfo.fishing.canusecnt, //可用次数
      fishes: petInfo.fishing.fishes || [],
      length: 1,
      harvestfish: petInfo.fishing.harvestfish,
      needTime: petInfo.fishing.needTime,
      power: petInfo.fishing.power,
      isvip: petInfo.otherOptions.pinkDiamond ? 1 : 0,
      vipLv: +petInfo.otherOptions.pinkDiamondLevel,
      yb: petInfo.info.yb,
    },
    head: {
      cmd: 1,
      game: 6,
      key: "",
      svr: 0,
      ver: 1,
    },
  };
  console.log("ResultData", ResultData);
  setTimeout(() => {
    setPETEVENT(ResultData);
  }, 0);
}

function loadIframe(env) {
  console.log("getPetInfoFromMain", getPetInfoFromMain);
  window.getPetInfoFromMain();
}
window.addEventListener("load", (event) => {
  player = document.getElementById("hlyg");
  console.log("load");
  getUpLoad();
  // if (await getUpLoad()) {
  //   console.log("window.getPetInfoFromMain");
  //   setInterval(() => {
  //     console.log("get 1");
  //     window.getPetInfoFromMain();
  //     console.log("get");
  //   }, 100);
  //   try {
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //   // loadIframe();
  // }
});

let getupI = 0;
const getUpLoad = () => {
  if (getupI++ > 1000) return;
  console.log(
    "window?.selfeLoad",
    window?.selfeLoad,
    typeof window.getPetInfoFromMain
  );
  if (window?.selfeLoad) {
    console.log("ok");
    window.getPetInfoFromMain();
    // return true;
  } else {
    setTimeout(() => {
      return getUpLoad();
    }, 10);
  }
};
//错误处理
function errorFishesDo() {
  console.log("清空");
  //清空🐟
  setCookie("fishes", "[]", true);
  //重获取
  getPetInfoAgain();
}
const setPetInfoAgain = (petInfo) => {
  //需要修改的
  /**petname
username
gender
yb
level
isvip
vipLv
allvipcnt
canusecnt */
  let o1 = petInfo.info.sex === "GG" ? 2 : 3,
    o2 = petInfo.maxInfo.level;
  o2 < 5 ? (o2 = "1") : o2 < 8 ? (o2 = "2") : (o2 = "0");
  let g = "1" + o2 + o1;
  console.log("g", g);
  setCookie("petname", petInfo.info.name);
  setCookie("username", petInfo.info.host);
  setCookie("gender", g);
  setCookie("yb", petInfo.info.yb); //给定初始元宝
  setCookie("level", petInfo.maxInfo.level);
  setCookie("isvip", petInfo.otherOptions.pinkDiamond ? 1 : 0);
  setCookie("vipLv", petInfo.otherOptions.pinkDiamondLevel);
  // setCookie("fishes", petInfo.fishing.fishes);
  setCookie("allvipcnt", petInfo.fishing.allvipcnt);
  setCookie("canusecnt", petInfo.fishing.canusecnt);
  setCookie("power", petInfo.fishing.power);
  setCookie("needTime", petInfo.fishing.needTime);
  console.log("setNew again");
  //主动进行数据展示
  getPetInfoAgain();
};
let getPetInfoAgainTime = null;
const getPetInfoAgain = () => {
  if (getPetInfoAgainTime) {
    clearTimeout(getPetInfoAgainTime);
  }
  getPetInfoAgainTime = setTimeout(() => {
    let fishes = JSON.parse(getCookie("fishes") || "[]");
    //配置成长时间
    if (fishes?.length) {
      for (let k in fishes) {
        if (+fishes[k].id > maxId) {
          maxId = +fishes[k].id;
        }
        fishes[k] = fishesGroup(fishes[k]).fishes;
      }
    }
    //获取缓存数据
    let ResultData = {
      data: {
        allvipcnt: getCookie("allvipcnt"),
        canusecnt: getCookie("canusecnt"),
        fishes: fishes,
        length: 1,
        harvestfish: getCookie("harvestfish"),
        needTime: getCookie("needTime"),
        power: getCookie("power"),
        isvip: +getCookie("isvip"),
        vipLv: +getCookie("vipLv"),
        yb: +getCookie("yb"),
      },
      head: {
        cmd: 1,
        game: 6,
        key: "",
        svr: 0,
        ver: 1,
      },
    };
    console.log("ResultData again", ResultData);
    setPETEVENT(ResultData);
    getPetInfoAgainTime = null;
  }, 200);
};

//从上层进行获取
// // 弹窗获取用户输入的名字和性别
// function getUserInfo() {
//   // const name = prompt("请输入宠物的名字：", "");
//   // if (!name) {
//   //   alert("名字不能为空！");
//   //   return;
//   // }

//   // const gender = prompt("请输入你的性别（GG/MM）：", "");
//   // if (!gender || (gender !== "GG" && gender !== "MM")) {
//   //   alert("性别输入无效！");
//   //   return;
//   // }
//   let name = "dfsdf";
//   let gender = "MM";
//   // 将信息存入 Cookie
//   setCookie("username", name);
//   setCookie("gender", gender);
//   setCookie("yb", 100); //给定初始元宝
//   setCookie("harvestfish", 0); //给定初始收获鱼数
//   setCookie("fishes", JSON.stringify([])); //给定初始鱼数
//   // alert(`你好，${name}！你的性别是${gender}。信息已保存到 Cookie 中。`);
// }

// // 示例用法
// if (!getCookie("username") || !getCookie("gender")) {
//   getUserInfo();
// }
// setTimeout(() => {
//   getPetInfo();
// }, 5000);

window["PSW"] = {
  GoToNPC: (param1) => {
    console.log("GoToNPC", param1);
  },
};
window.close_game = function (e) {
  console.log("close_game", e);
  close_game && close_game();
};

// //宠物个体信息

window.SNS_GetSelfPetInfo = function () {
  var petinfo = {
    petid: "1",
    qqnumber: "66666666",
    petName: getCookie("petname"),
    masterName: getCookie("username"),
    level: getCookie("level"),
    isvip: +getCookie("isvip"),
    grade: getCookie("gender"),
    gender: getCookie("gender"),
    staus: 1,
    starve: getCookie("starve"),
    starveMax: getCookie("starveMax"),
    clean: getCookie("clean"),
    cleanMax: getCookie("cleanMax"),
    qqsign: "",
    viplevel: +getCookie("vipLv"),
  };
  // console.log("swf 调取了获取信息", petinfo);
  return petinfo;
};

// window.test = async function () {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   return "result";
// };

// //flash.external.ExternalInterface.call("console.log","showPageAt");
window.PETSendData = function (dataOl) {
  //console.log("PETSendData_start");
  var data = JSON.parse(dataOl);
  console.log("data 选择", data);
  var result = {};
  switch (data.head.cmd) {
    case 1: //获取池塘信息
      getPetInfoAgain();
      return;
    case 2: //使用饲料
      result.id = data.data.id;
      let PondFishes2 = getCookie("fishes") || "[]";
      PondFishes2 = JSON.parse(PondFishes2);
      let msg = 5;
      for (let k in PondFishes2) {
        if (PondFishes2[k].id == data.data.id) {
          //有
          if (PondFishes2[k].stage) {
            // console.log("PondFishes2[k]", PondFishes2[k]);
            if (PondFishes2[k].stage >= 3) {
              msg = 6;
            } else {
              msg = 8;
              //进行加饲料数
              if (!PondFishes2[k].siLiao) {
                PondFishes2[k].siLiao = 1;
              } else {
                PondFishes2[k].siLiao++;
              }
              //进行成长
              let rs = fishesGroup(PondFishes2[k]);
              PondFishes2[k] = rs.fishes;
            }
          }
          break;
        }
      }
      result.result = msg;
      if (msg == 8) {
        //成功
        setCookie("fishes", JSON.stringify(PondFishes2), true);
        setCookie("yb", Number(getCookie("yb")) - 5, true);
        result.msg = "使用成功~";
        setTimeout(() => {
          getPetInfoAgain();
        }, 100);
      } else if (msg == 6) {
        result.msg = "当前🐟儿已成熟~";
      } else {
        result.msg = "使用错误~";
      }
      break;
    case 3: //获取商店信息
      let s = [];
      for (let k in shop) {
        s[k] = {
          ...shop[k],
          price_yb: shop[k].price_yb / 0.8,
        };
      }
      result.fries = s;
      result.totalpage = 1; //告知请求几次
      //判断是否和当前🐟数是一样的
      break;
    case 4: //逐个购买鱼苗
      if (data.data.paytype == 1) {
        //元宝购买
        let id = data.data.fryid;
        // if (id >= 28) {
        //   id -= 4;
        // }
        let fish = null;
        for (let k in shop) {
          if (shop[k].fryid == id) {
            fish = shop[k];
          }
        }
        var yb = Number(getCookie("yb"));
        let PondFish4 = getCookie("fishes") || "[]";
        console.log("PondFish4", PondFish4);
        PondFish4 = JSON.parse(PondFish4);
        // console.log("yb", yb, fish, data, PondFish4);
        if (PondFish4.length >= 5) {
          result.result = 5;
          result.msg = "已经满了";
        } else if (yb < fish.price_yb) {
          result.result = 1;
          result.msg = "元宝不足!";
        } else {
          result.result = 0;
          maxId += 1;
          PondFish4.push({
            id: maxId,
            fryid: fish.fryid,
            name: fish.name,
            stage: 1,
            time: 0,
            interval: fish.interval,
            costyb: fish.price_yb,
            YB: fish.sell_price,
            quantity: fish.quantity,
            basequantity: fish.quantity,
            avatar: fish.avator,
            AIXIN: 0,
            growth: 0,
            strong: 0,
            iq: 0,
            charm: 0,
            born: Math.floor(Date.now() / 1000),
            siLiao: 0, //累计当前阶段使用饲料情况。每个饲料减少1个小时成长时间
          });
          setCookie("fishes", JSON.stringify(PondFish4), true);
          setCookie("yb", Number(yb) - Number(fish.price_yb), true);
        }
      } else {
        // paytype == 2  Q币购买, paytype == 3 Q点购买
        result.result = 1;
      }
      /*
          result.result = 1;  元宝/Q币不足
          result.result = 2;  池塘已满

          result.result = 3;  自定义购买失败消息
          result.msg = "购买失败!";
          */
      break;
    case 5: //逐个收获
      var yb = getCookie("yb");
      let PondFish5 = getCookie("fishes") || "[]";
      PondFish5 = JSON.parse(PondFish5);
      let fish = null,
        inWhereI = null;
      for (var i = 0; i < PondFish5.length; ++i) {
        if (PondFish5[i].id == data.data.id) {
          fish = PondFish5[i];
          inWhereI = i;
          break;
        }
      }
      if (inWhereI == 0 || inWhereI) {
        if (fish.stage == 3) {
          result.yb = Number(fish.YB) * Number(fish.quantity);
        } else {
          result.yb = Number(fish.costyb) / 2;
        }
        result.yb = Math.floor(result.yb);

        setCookie("yb", Number(yb) + Number(result.yb), true);
        PondFish5.splice(inWhereI, 1);

        for (var i = 0; i < PondFish5.length; ++i) {
          PondFish5[i].id = i + 1;
        }
        setCookie("fishes", JSON.stringify(PondFish5), true);
        setCookie("harvestfish", Number(getCookie("harvestfish")) + 1, true);
        result.result = 0;
        result.msg = "收获成功!";

        result.growth = 0;
        result.strong = 0;
        result.charm = 0;
        result.iq = 0;
        console.log("result", result);
      } else {
        //没找到对应🐟
        result.result = 5;
        result.msg = "捕获出错了！请重新打开页面再试试吧~";
      }
      break;
    case 7: //粉转使用一键成长
      let canusecnt = Number(getCookie("canusecnt")) - 1;
      if (canusecnt >= 0) {
        let PondFishes7 = getCookie("fishes") || "[]";
        PondFishes7 = JSON.parse(PondFishes7);
        if (PondFishes7?.length) {
          for (let k in PondFishes7) {
            if (PondFishes7[k].stage < 3) {
              //进行加饲料数
              if (!PondFishes7[k].siLiao) {
                PondFishes7[k].siLiao = 1;
              } else {
                PondFishes7[k].siLiao++;
              }
              PondFishes7[k] = fishesGroup(PondFishes7[k]).fishes;
            }
          }
          setCookie("fishes", JSON.stringify(PondFishes7), true);
          setCookie("canusecnt", canusecnt, true);
        } else {
          result.result = 5;
          result.msg = "使用失败，当前没有🐟~";
        }
      } else {
        result.result = 5;
        result.msg = "使用失败，当前没有次数~";
      }

      break;
    case 8: //一键收获
      let PondFishs8 = getCookie("fishes") || "[]";
      PondFishs8 = JSON.parse(PondFishs8);
      var yb = +getCookie("yb");
      let addYb = 0;
      if (PondFishs8?.length) {
        let len = PondFishs8.length - 1;
        for (let k = len; k >= 0; k--) {
          if (PondFishs8[k].stage == 3) {
            //收获
            let ad = Number(PondFishs8[k].YB) * Number(PondFishs8[k].quantity);
            addYb += ad;
            //特效
            // let data = {
            //   data: {
            //     charm: 0,
            //     growth: 0,
            //     iq: 0,
            //     msg: "收获成功!",
            //     result: 0,
            //     strong: 0,
            //     yb: ad,
            //   },
            //   head: {
            //     cmd: 8,
            //     game: 6,
            //     key: "",
            //     svr: 0,
            //     ver: 1,
            //   },
            // };
            // player.PETEventOnReceived(JSON.stringify(data));
            //删除🐟
            PondFishs8.splice(k, 1);
          }
        }
        if (addYb) {
          setCookie("yb", Number(yb) + +addYb, true);
          setCookie("fishes", JSON.stringify(PondFishs8), true);
          result.result = 1;
          result.msg = "一键收获成功，🐟~";
          setTimeout(() => {
            getPetInfoAgain();
          }, 500);
          // return;
        } else {
          //保存🐟
          result.result = 5;
          result.msg = "一键收获失败，当前没有成熟的🐟~";
        }
      } else {
        // 没有🐟
        result.result = 5;
        result.msg = "一键收获失败，当前没有🐟~";
      }
      console.log("一键收获 result", result);
      break;
    case 10: //免费饲料
      // result.result = 0;
      // result.harvestfish = 500;
      result.result = 5;
      result.msg = "该功能搭建中~~";
      break;
    default:
      // 没有🐟
      result.result = 5;
      result.msg = "未知指令~ cmd:" + data.head.cmd + "  data:" + dataOl;
      break;
  }
  var ResultData = {
    data: result,
    head: data.head,
  };
  console.log("ResultData", ResultData);
  player.PETEventOnReceived(JSON.stringify(ResultData));
  //console.log("PETSendData_end");
};
