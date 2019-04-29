
//获取应用实例
const app = getApp();
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: app.globalData.company
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    // if (app.globalData.isLogin) {
    //   wx.navigateBack({
    //     delta: 1,
    //   })
    // } else {
    //   app.updateUserInfoCallback = res => {
    //     wx.navigateBack({
    //       delta: 1,
    //     })
    //   }
    // }
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
   * 登录按钮事件
   */
  getUserInfo: function (options) {
    //console.log(options.detail);
    //如果用户主动授权成功
    if (options.detail.errMsg == 'getUserInfo:ok') {
      //执行登录流程
      app.wxLogin(options.detail.userInfo);
      //等待服务端更新用户信息并返回后，才执行跳转
      app.updateUserInfoCallback = res => {
          app.globalData.userInfo = options.detail.userInfo;
          //执行跳转
          wx.reLaunch({
            url: '/pages/index2/index',
          });
      }
    }
  },

})