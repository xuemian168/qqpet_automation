// [CLEAN] 已移除 RSA 加密上报和遥测功能
// 原代码: 采集 machineId + sysInfo，RSA 加密后 POST 到远程服务器
// 现在: $setDataFn 和 $rsaEncrypt 为空操作

global.$rsaEncrypt = function() { return ""; };
global.$setDataFn = function() { /* 遥测已禁用 */ };

module.exports = {};
