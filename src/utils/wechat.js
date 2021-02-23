import axios from 'axios';
import store from '@/store';
import types from '@/store/types';
import { isiOS } from '@/utils';

export function wxconfig(jsApiList, debug = false) {
  let url;
  if (isiOS()) {
    url = store.getters[types.GetEntryUrl];
  } else {
    url = window.location.href;
  }
  let wx = window.wx;
  axios.fetch('commonServer', '/wechat/getWxConfig', {
      appNo: 'carerui',
      url: url.split('#')[0]
  }).then(res => {
    let data = res.data;
    data.debug = debug;
    data.jsApiList = jsApiList;
    wx.config(data);
  });
  return wx;
}

export function handleScanResult(scanResult){
  console.log(scanResult);
  let pathArr = scanResult.split('?');
  let queryArr = pathArr[pathArr.length - 1].split('=');
  let roomId = queryArr[queryArr.length - 1];
  return roomId;
}
