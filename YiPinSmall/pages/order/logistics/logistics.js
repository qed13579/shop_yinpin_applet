// pages/order/logistics/logistics.js
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    com: 0,
    num: 0,
    list: [],
    logisticsid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      com: options.com,
      num: options.num,
    })
    console.log(options)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.loadingDatatop(true);
  },
  loadingDatatop: function (isShowLoading) {
    var that = this;
    that.getlogistics(isShowLoading);
  },


  getlogistics: function (isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/Logistics";
    var usertoken = utils.getStorageSync("userToken");

    var token = app.globalData.initToken;
    var num = that.data.num
    var com = that.data.num
    var params = { com: "yuantong", num: "500306190180" };
    //手动显示加载框
    if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function (res) {
      var res = datas.logistics
      var list = res.data;
      console.log("返回来的数据", res)
      var data = res.data
      var list = [];
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          if (i == data.length - 1 && i != 0) {//最早的那个但不止一个
            var status = 0;
          } else if (i == 0 && i == data.length - 1) {//又是最近的那个又是最早的那个
            var status = 1;
          } else if (i == 0 && i != data.length - 1) {//最近的那个但不是不止一个
            var status = 2;
          } else {//中间的那些
            var status = 3;
          }
          var obj = new Object({
            "status": status,
            "context": item.context,
            "ftime": item.ftime,
            "time": item.time,
          });
          list.push(obj);
        }
      }
      console.log("list", list)


      that.setData({
        list: list,
        logisticsid: res.nu
      });


      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})