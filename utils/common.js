/**
 * 
 */
const utils = require("util.js");
const datas = require("data.js");
/**
 * 提交任务方法
 * sign 任务类型
 */
const doTask = function(sign, callback) {
  //var that = this;
  const app = getApp();
  var apiUrl = app.globalData.webUrl + "/home/Task";
  var usertoken = utils.getStorageSync("userToken");
  var token = app.globalData.initToken;
  var params = {
    sign: sign,
    userToken: usertoken,
    token: token
  };
  if (usertoken != undefined || usertoken != null) {
    //发起网络请求
    utils.netRequest(apiUrl, params,
      //任务成功回调
      function(res) {
        console.log('--任务提交成功！--');
        if (callback) callback();
      },
      function(res) {
        utils.wxshowToast(res.error);
      }, "POST", false);
  }
}

/**
 * 获取任务类型列表
 */
const getTaskTypeList = function() {
  var that = this;
  const app = getApp();
  var apiUrl = app.globalData.webUrl + "/home/GetTaskSign";
  var paramData = {
    token: app.globalData.initToken
  };
  //发起请求
  utils.netRequest(apiUrl, paramData, function(res) {
    console.log("-- 获取任务类型列表成功 --");
    app.globalData.taskTypeList = res.data;
    if (that.getTaskTypeListCallback) {
      that.getTaskTypeListCallback(res.data);
    }
  }, null, "GET");
}

/**
 * 根据类型和内容源Id 获取分享配置的数据
 * typeid 分享类型 1：抢座 2：资讯 3：兑换券 4：商城
 * sourceId 对应数据 Id
 * that 当前页面对象，当前页面 data 必须包含 title、imageUrl
 * callback 回调
 */
const getShareData = function(typeid, sourceId, that, callback) {
  const app = getApp();
  var apiUrl = app.globalData.webUrl + "/home/GetShare";
  var paramData = {
    type: typeid,
    sourceId: sourceId,
    token: app.globalData.initToken
  };
  //默认分享对象
  var shareObj = new Object({
    title: that.data.title,
    path: that.data.path, //获取当前页面路径
    imageUrl: that.data.imageUrl
  });
  //获取后台配置的分享对象
  utils.netRequest(apiUrl, paramData, function(res) {
    if (res.data != null) {
      var obj = res.data;
      if (obj.title || obj.title != '') {
        shareObj.title = obj.title;
      }
      if (obj.url || obj.url != '') {
        shareObj.path = obj.url;
      }
      if (obj.img || obj.img != '') {
        shareObj.imageUrl = obj.img;
      }
    }
    callback(shareObj);
  }, function(res) {
    callback(shareObj);
  }, "GET");
}

const gotoAuthorize = function() {
  //如果用户未授权，而打开的当前路径又不是授权登录页面，则跳转
  //否则不再重复执行跳转
  if (utils.getCurrentPageUrl().indexOf('authorize') ==-1){
    wx.reLaunch({
      url: '/pages/authorize/authorize',
    });
  }
}

/**
 * 根据小程序版本号，获取域名
 * webUrl = testyplt.kuailaiyingka.com 初始域名
 * webUrl = yplt.kuailaiyingka.com 微信审核通过后使用的域名
 */
const getWebUrl = function(ver, callback, fail) {
  var that = this;
  const app = getApp();
  var apiUrl = app.globalData.webUrl + "/home/GetUrl";
  var params = {
    ver: ver
  };
  //发起请求
  // utils.netRequest(apiUrl, params, function(res) {

    var res = datas.GetUrlincommon

    console.log("webUrl", res.data);
    if (res.data != "") {
      app.globalData.webUrl = res.data;
    }
    callback(res);

  // }, "GET", function(res) {
  //   fail(res);
  // });
}

/**
 * 公开接口
 */
module.exports = {
  doTask: doTask,
  getTaskTypeList: getTaskTypeList,
  getShareData: getShareData,
  gotoAuthorize: gotoAuthorize,
  getWebUrl: getWebUrl,
}