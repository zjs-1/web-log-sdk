import bom from '../common/bom';
import eventUtil from '../common/eventUtil';
import getXPath from '../utils/getXPath';
import sliceText from '../utils/sliceText';
import defaultOption from './option';
import getEvent from '../common/getEvent';
import getBoundingClientRect from '../utils/getBoundingClientRect';

const {
  doc,
  ref,
  title,
  loc,
} = bom;

class AutoLogger {
  constructor(option) {
    this.option = Object.assign(this.defaultOption, option);
    this._init();
    if (typeof option.log === 'function') this.log = option.log;
  }

  get defaultOption() {
    return defaultOption;
  }

  _autoClickCollection = () => {
    eventUtil.on(doc.body, 'click', this._autoClickHandle);
  };

  _autoClickHandle = (e) => {
    try {
      const logData = this._getLogData(e);
      this.log(logData);
    } catch (err) {
      console.log(err);
    }
  };

  _getLogData = (e, assignData = {}) => {
    const { targetElement, event } = getEvent(e);
    const nodeName = targetElement.nodeName && targetElement.nodeName.toLocaleLowerCase() || '';
    const text = targetElement.innerText || targetElement.value;
    const xpath = getXPath(targetElement) || '';
    const rect = getBoundingClientRect(targetElement);
    const documentElement = document.documentElement || document.body.parentNode;
    const scrollX = (documentElement && typeof documentElement.scrollLeft == 'number' ? documentElement : document.body).scrollLeft;
    const scrollY = (documentElement && typeof documentElement.scrollTop == 'number' ? documentElement : document.body).scrollTop;
    const pageX = event.pageX || event.clientX + scrollX;
    const pageY = event.pageY || event.clientY + scrollY;

    const eventData = {
      // event type
      et: 'click',
      // event desc
      ed: 'auto_click',
      text: sliceText(text),
      nodeName,
      xpath,
      offsetX: ((pageX - rect.left - scrollX) / rect.width).toFixed(6),
      offsetY: ((pageY - rect.top - scrollY) / rect.height).toFixed(6),
      pageX,
      pageY,
      scrollX,
      scrollY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    return this._buildLogData(Object.assign(eventData, assignData));
  };

  _buildLogData = (eventData) => {
    const { optParams, platform, appID, sdk } = this.option;
    return {
      eventData: {
        ...eventData,
        rUrl: ref,
        docTitle: title,
        cUrl: loc.href,
        t: new Date().getTime(),
      },
      optParams,
      platform,
      appID,
      sdk,
    };
  };

  log = (data) => {
    console.log(data);
  };

  _init() {
    try {
      if (this.option.autoClick) {
        this._autoClickCollection();
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default AutoLogger;
