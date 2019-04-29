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
    goodlist: null,
    hidden: true

  },

  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    // that.setData({
    //   webUserData: datas.webUserData.data
    // })

    that.loaddingData(true);
    // setTimeout(() => {
    //   that.setData({
    //     showSkeleton: false
    //   })
    // }, 3000)
  },
  /**
   * 
   */
  onShow: function(options) {
    var that = this;

  },

  loaddingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.getRecommend(isShowLoading);
      that.setData({
        webUserData: app.globalData.webUserData,
        // showSkeleton: false
      });
    } else {
      app.checkSession();
      app.updateUserInfoCallback = res => {
        that.getRecommend(isShowLoading);
        if (res.data) {
          that.setData({
            webUserData: app.globalData.webUserData,
            // showSkeleton: false
          });
        } else {
          common.gotoAuthorize();
        }
      }
    }
  },
  // 请求推荐块的数据
  getRecommend: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/MallProduct/GetRecommend";
    // var usertoken = utils.getStorageSync("userToken");
    var id = 15;
    var params = {
      curPid: id
    };
    //手动显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function(res) {

      var res = datas.recommend
      var data = res.data;
      var list = [];
      for (let i = 0; i < 2; i++) {
        var item = data[i]
        list.push(item);
      }
      // console.log(list);
      that.setData({
        goodlist: list
      });
      setTimeout(() => {
        that.setData({
          hidden: false,
          showSkeleton: false,
        })
      }, 200)
      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
  },

})