const getXPath = (elm) => {
  try {
    const segs = [];

    for (; elm && elm.nodeType === 1; elm = elm.parentNode) {
      if (elm.hasAttribute('id')) {
        let uniqueIdCount = 0;

        const allNodes = document.querySelectorAll('[id]');
        for (let n = 0; n < allNodes.length; n++) {
          if (allNodes[n].id === elm.id)
            uniqueIdCount++;
          if (uniqueIdCount > 1) break;
        }

        if (uniqueIdCount === 1) {
          segs.unshift('//*[@id="' + elm.getAttribute('id') + '"]');
          return segs.join('/');
        } else {
          return false;
        }
      } else {
        let i = 1;

        for (let sib = elm.previousSibling; sib; sib = sib.previousSibling) {
          if (sib.localName === elm.localName) i++;
        }

        // 前面有其他同名元素 或 后面有其他同名元素
        if (i > 1 || (elm.nextSibling && elm.nextSibling.localName === elm.localName)) {
          segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
        } else {
          segs.unshift(elm.localName.toLowerCase());
        }
      }
    }
    return segs.length ? '/' + segs.join('/') : null;
  } catch (err) {
    return null;
  }
};

export default getXPath;
