const doTypes = {
  /**去除所有图片 */
  cutImgs: `  // 获取所有图片元素
const images = document.querySelectorAll('img');

// 应用CSS灰度滤镜
images.forEach(img => {
  img.style.filter = 'grayscale(100%)';
  img.style.opacity = '0.2';
  // 兼容旧版浏览器
  img.style.webkitFilter = 'grayscale(100%)';
  img.remove()
});

// 可选：处理背景图片
document.querySelectorAll('*').forEach(el => {
  const bg = getComputedStyle(el).backgroundImage;
  if(bg && bg !== 'none') {
    el.style.filter = 'grayscale(100%)';
  el.style.opacity = '0.2';
    el.style.webkitFilter = 'grayscale(100%)';
  el.remove()
  }
});`,
readVideo:`

`,
getText:`
function rebuildFullDOM() {
  // 创建新文档
  const newDoc = document.implementation.createHTMLDocument();
  const newBody = newDoc.body;
  
  // 复制原始样式和meta信息
  document.querySelectorAll('style, link[rel="stylesheet"], meta').forEach(el => {
    newDoc.head.appendChild(el.cloneNode(true));
  });

  // 创建内容容器
  const container = newDoc.createElement('div');
  container.id = 'rebuild-container';
  
  // 获取所有元素节点
  const allElements = document.body.getElementsByTagName('*');
  
  // 重建DOM结构
  Array.from(allElements).forEach(element => {
    if(element.nodeType === Node.ELEMENT_NODE) {
      // 处理A标签
      if(element.tagName === 'A') {
        const newA = newDoc.createElement('a');
        newA.href = element.href;
        newA.textContent = element.textContent;
        // 复制所有属性
        Array.from(element.attributes).forEach(attr => {
          newA.setAttribute(attr.name, attr.value);
        });
        container.appendChild(newA);
      } 
      // 处理包含文本的其他元素
      else if(element.textContent.trim()) {
        const newEl = newDoc.createElement(element.tagName.toLowerCase());
        // 复制所有属性
        Array.from(element.attributes).forEach(attr => {
          newEl.setAttribute(attr.name, attr.value);
        });
        // 复制文本内容
        newEl.textContent = element.textContent;
        container.appendChild(newEl);
      }
    }
  });

  newBody.appendChild(container);
  
  // 替换整个文档
  document.open();
  document.write(newDoc.documentElement.outerHTML);
  document.close();
}

// 执行函数
rebuildFullDOM();

`
};
module.exports = doTypes;
