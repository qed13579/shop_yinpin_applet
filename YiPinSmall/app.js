



//app.js
// wx296c0425d7821b6a
const utils = require("utils/util.js");
const common = require("utils/common.js");
const datas = require("utils/data.js");
const updateManager = wx.getUpdateManager(); //用来管理更新
App({
  onLaunch: function() {
    var that = this;
    //隐藏导航栏
    wx.hideTabBar();
    //监听向微信后台请求检查更新结果事件。微信在小程序冷启动时自动检查更新，不需由开发者主动触发。
    updateManager.onCheckForUpdate(function(res) {
      //console.log("res", res);
      // 请求完新版本信息的回调
      console.log("小程序是否有更新", res.hasUpdate);
      if (res.hasUpdate) {
        //监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
        that.onUpdateReady();
      }
      // else {
      //   that.checkSession();
      // }
    });

    //监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
      utils.wxShowModal("更新提示", "新版本下载失败，是否重新下载？",
        function(res) {
          that.onUpdateReady();
        });
    });


    wx.getSystemInfo({
      success: function(res) {
        //console.log(res.model)
        //console.log(res.language)//zh_CN(en)
        //console.log(res.model=="iPhone X")
        console.log("是否 iPhone X", res.model.indexOf("iPhone X"))
        if (res.model.indexOf("iPhone X") > -1) {
          that.globalData.isIPX = 1;
        }
      }
    });

  },

  //检查微信登录是否有效
  checkSession: function() {
    var that = this;
    wx.checkSession({
      success: function(res) {
        console.log("登录有效", res);
        //根据版本号获取请求域名,由服务端决定
        that.getWXUserInfo(function(WXUserInfo) {
          //执行登录流程
          that.wxLogin(WXUserInfo);
          that.globalData.userInfo = WXUserInfo;
        });

      },
      fail: function(res) {
        console.log("登录无效", res);
        common.gotoAuthorize();
      }
    })
  },

  //封装方法，以重复调用
  //监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
  onUpdateReady: function() {
    updateManager.onUpdateReady(function() {
      utils.wxShowModal("更新提示", "新版本已经准备好，是否重启应用？",
        function(res) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        });
    });
  },

  /**
   * 获取微信用户信息
   * 只有当用户已经授权，才可以使用该接口
   */
  getWXUserInfo: function(callback) {
    //已经授权，可以直接调用 getUserInfo 获取头像昵称
    wx.getUserInfo({
      success: res => {
        console.log('--微信用户信息获取成功！--');
        console.log(res.userInfo);
        callback(res.userInfo);
      },
      fail: res => {
        console.log('--微信用户信息获取失败！--');
        console.log(res);
        common.gotoAuthorize();
      }
    })
  },
  //testadminyplt.
  //testyplt
  //测试域名头
  globalData: {
    userInfo: null, //微信用户信息
    webUserData: null, //平台用户信息
    // webUrl: "https://yplt.kuailaiyingka.com", //线上
    //webUrl: "https://testyplt.kuailaiyingka.com", //测试域名
    webUrl: "http://yplt.kuailaiyingka.comz",//线下
    isLogin: false,
    company: '忆品良田开饭喔',
    isIPX: 0,
    sysVer: "0.0.1"
  },
  /**
   * 第一步：微信登录
   * WXUserInfo 从用户授权界面主动获取用户信息并传入
   */
  wxLogin: function(WXUserInfo) {
    //手动开启加载提示
    //utils.wxShowLoading("请稍候...", true);
    wx.login({
      success: res => {
        var that = this;
        console.log('--1、微信用户登录成功--！');
        //微信登录成功后，获取微信用户的信息
        //如果有传入则直接赋值，否则调用微信 API 接口获取用户信息
        console.log(WXUserInfo)
        if (WXUserInfo) {
          that.globalData.userInfo = WXUserInfo;
          //微信登录后返回的 code
          var wxcode = res.code;
          //发送 res.code 到后台换取 openId, sessionKey, unionId
          //that.onLogin(that.globalData.initToken, wxcode);
          //根据小程序版本号，获取服务端对应的域名
          common.getWebUrl(that.globalData.sysVer, function() {
            that.onLogin(wxcode);
          }, function() {
            utils.wxshowToast("抱歉，请求失败！", "none");
          });

        } else {
          common.gotoAuthorize();
        }
      }
    });
  },
  /**
   * 第二步：微信用户登录成功后，执行同步登录操作
   * code 微信登录成功后返回的 code
   */
  onLogin: function(code) {
    var that = this;
    var apiUrl = that.globalData.webUrl + "/wxopen/onlogin";
    var params = {
      code: code
    }
    //第二步：执行同步登录
    // utils.netRequest(apiUrl, params, function(res) {




      var res = datas.onlogininlogin


      console.log("--2、同步登录成功！--", res);
      try {
        // 缓存 usertoken 和 sessionKey 到本地存储中
        utils.setStorageSync("userToken", res.data.userToken);
        utils.setStorageSync("sessionKey", res.data.sessionKey);
      } catch (e) {
        console.log("setStorageSync error", e);
        updateManager.applyUpdate(); //重启小程序
      }
      //utils.setStorageSync("wxOpenId", res.data.wxOpenId);
      //第三步：更新用户信息
      that.updateUserInfo(res.data.userToken);
      //获取 access_token
      //that.getAccessToken(res.data.sessionKey);





    // }, function(res) {
    //   console.log(res);
    //   utils.wxshowToast(res.error);
    //   setTimeout(function() {
    //     common.gotoAuthorize();
    //   }, 2500);
    // }, "GET", false);
  },

  /**
   * 第三步：更新用户信息
   */
  updateUserInfo: function(userToken) {
    var that = this;
    var apiUrl = that.globalData.webUrl + "/wxopen/updateinfo";
    //构造参数
    //console.log(userInfo);
    var userInfo = this.globalData.userInfo;
    if (userInfo != null) {
      var params = new Object();
      params.userToken = userToken;
      params.nickName = userInfo.nickName;
      params.avatarUrl = userInfo.avatarUrl;
      params.gender = userInfo.gender;
      params.address = userInfo.province + "," + userInfo.city;
      //params.token = token;
      //console.log(params);
      //发起请求
      // utils.netRequest(apiUrl, params, function(res) {


      var res = datas.updateinfoinlogin

        
        console.log("--3、更新用户信息成功--", res)
        //设置全局登录的变量
        that.globalData.isLogin = true;
        that.globalData.webUserData = res.data;
        //获取更新后的用户信息
        //that.getUserData(userToken);
        //由于 updateinfo 需要通过网络请求，可能会在 Page.onLoad 之后才返回
        //因此提供 updateUserInfoCallback 以防止这种情况
        if (that.updateUserInfoCallback) {
          that.updateUserInfoCallback(res);
        }
        //获取任务类型列表
        //common.getTaskTypeList();




        
      // }, function(res) {
      //   //that.wxLogin();
      //   common.gotoAuthorize();
      // }, "GET", false);
    }
  },

})