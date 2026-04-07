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

window.closeFrame = () => {
  console.log("closeFrame", "guanbi");
  close_game && close_game()
};
