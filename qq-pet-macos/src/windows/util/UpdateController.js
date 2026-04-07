// [CLEAN] 已禁用自动更新（不连接远程服务器）
const checkUpdate = (fn) => {
  if (fn) {
    fn({ type: "not", msg: "当前为本地干净版，自动更新已禁用~" });
  }
};

module.exports = checkUpdate;
