// pages/firstpage/firstpage.js
const utils = require("../../utils/util.js");
const datas = require("../../utils/data.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seconds: 3,
    topList: [],
    only: false,
    ishidden: true,
    isvideo: 2,
    videourls: ['https://api.kuailaiyingka.com/data/video/ad.mp4'],
    seconds1: "",
    ishidden1: true,
    // imgok:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.isLogin) {
      this.getData();
    } else {
      app.checkSession();
      app.updateUserInfoCallback = res => {
        this.getData();
      }
    }
  },
  startSetInter: function () {
    console.log(1)
    // this.data.imgok=1
    var imgok = 0
    var that = this
    //  that.data.imgok1= setInterval(function(){
    if (that.data.isvideo == 0) {
      // var that = this;
      that.setData({
        ishidden: false
      })
      //将计时器赋值给setInter
      that.data.setInter = setInterval(
        function () {

          var numVal = that.data.seconds - 1;
          that.setData({ seconds: numVal });

          console.log(that.data.seconds)

          if (that.data.seconds <= 0) {
            clearInterval(that.data.setInter)
            // console.log(that.data.setInter)
            wx.switchTab({
              url: '/pages/index2/index',
            })

          }
        }
        , 1000);
    }
    //   imgok++
    // },200)
    // if (imgok==10){
    //   clearInterval(that.data.imgok1)
    // }

  },
  nav: function () {
    var that = this;
    wx.switchTab({
      url: '/pages/index2/index',
    })
  },
  endSetInter: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearInterval(that.data.setInter)
  },

  getData: function () {
    var that = this;
    //头顶轮播图的数据
    that.getAdDataById("20181115132030a1f2b0", function (list) {

      that.setData({
        topList: list
      })
      if (that.data.topList.length == 1) {
        that.setData({
          only: true
        })
        var item = that.data.topList[0];
        if (item.img.indexOf('.jpg') != -1 || item.img.indexOf('.png') != -1) {
          that.setData({
            isvideo: 0
          })
        }
        else if (item.img.indexOf('.mp4') != -1) {
          that.setData({
            videourls: list[0].img,
            isvideo: 1
          })
        } else {
          wx.switchTab({
            url: '/pages/index2/index',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }

      }
      if (that.data.topList.length == 0) {
        wx.switchTab({
          url: '/pages/index2/index',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },

  getAdDataById: function (id, callback, errorCallback) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/Block/GetAdData";
    var usertoken = utils.getStorageSync("userToken");
    var token = app.globalData.initToken;
    var params = {
      id: id
    };
    //手动显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function (res) {
      var res=datas.firstpage
      var list = res.data
      callback(list);
    // }, function (res) {
    //   wx.switchTab({
    //     url: '/pages/index2/index',
    //     success: function (res) { },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    // }, 'GET');
  },




  mytap: function (e) {
    var that = this;
    // console.log(e)
    that.setData({
      ishidden1: false,
      seconds1: Math.floor(e.detail.duration - e.detail.currentTime)
    });
    if (that.data.seconds1 <= 0) {
      wx.reLaunch({
        url: '/pages/index2/index',
      })
    }
  },
  errorvideo: function () {
    console.log("出错")
  },



  error: function () {
    console.log(123)
    // this.endSetInter()
  },






  nav: function () {
    wx.switchTab({
      url: '/pages/index2/index',
    })
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
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    clearInterval(that.data.setInter)
    // clearInterval(that.data.imgok1)


    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    clearInterval(that.data.setInter)
    // clearInterval(that.data.imgok1)


    var that = this;
    clearInterval(that.data.setInter1)
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