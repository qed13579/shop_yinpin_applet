//获取应用实例
const app = getApp();
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const common = require("../../../utils/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    webUserData: null,
    showSkeleton: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // that.setData({
    //   webUserData: datas.webUserData.data
    // })

    that.loaddingData();
    // setTimeout(() => {
    //   that.setData({
    //     showSkeleton: false
    //   })
    // }, 3000)
  },
  /**
   * 
   */
  onShow: function (options) {
    var that = this;

  },

  loaddingData: function () {
    var that = this;
    if (app.globalData.isLogin) {
      that.setData({
        webUserData: app.globalData.webUserData,
        showSkeleton: false
      });
    } else {
      app.updateUserInfoCallback = res => {
        if (res.data) {
          that.setData({
            webUserData: app.globalData.webUserData,
            showSkeleton: false
          });
        } else {
          common.gotoAuthorize();
        }
      }
    }
  }

})