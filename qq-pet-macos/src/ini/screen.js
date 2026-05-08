(() => {
  var __webpack_exports__ = {};
  const _require = eval("require");
  const { screen } = _require("electron");

  let size = null;
  let oneSize = [0, 0];

  const getWorkArea = (display) => display.workArea || display.bounds || { x: 0, y: 0, width: 0, height: 0 };

  const changeScreenSize = () => {
    const displays = screen.getAllDisplays();
    const primaryId = screen.getPrimaryDisplay().id;
    let maxX = 0;
    let maxY = 0;

    for (const display of displays) {
      const area = getWorkArea(display);
      if (!oneSize[0] || display.id === primaryId) {
        oneSize = [area.width, area.height];
      }
      maxX = Math.max(maxX, area.x + area.width);
      maxY = Math.max(maxY, area.y + area.height);
    }

    size = [Math.max(maxX, oneSize[0]), Math.max(maxY, oneSize[1])];
    return size;
  };

  global.getScreenSize = (reload = false, primary = false) => {
    if (primary) return oneSize;
    return size && !reload ? size : changeScreenSize();
  };

  screen.on("display-added", changeScreenSize);
  screen.on("display-removed", changeScreenSize);
  screen.on("display-metrics-changed", changeScreenSize);

  changeScreenSize();
  module.exports = __webpack_exports__;
})();
