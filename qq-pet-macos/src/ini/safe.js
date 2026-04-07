// [CLEAN] 已移除设备指纹采集
// 原代码: 使用 node-machine-id 采集硬件唯一标识
// 现在: 提供空数据，不采集任何设备信息

class isSafe {
  machineId = "local-only";
  sysInfo = "{}";
}

global.isSafe = new isSafe();
module.exports = {};
