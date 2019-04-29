// pages/user/addcard/addcard.js
var app = getApp();
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // that.loadingData(true);
  },

  loadingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {


    } else {
      app.updateUserInfoCallback = res => {}
    }
  },
  //添加新的礼品卡
  cardformsubmit: function(e) {
    console.log('卡号', e.detail.value.number)
    console.log('密码', e.detail.value.pswd)

    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/bindcard";
    var usertoken = utils.getStorageSync("userToken");
    var number = e.detail.value.number;
    var password = e.detail.value.pswd;
    if(!number){
      wx.showToast({
        title: '请输入礼品卡号！',
        icon: 'none'
      })
      return false;
    }
    else if(!password){
      wx.showToast({
        title: '请输入礼品卡号密码！',
        icon: 'none'
      })
      return false;
    }else{
      var params = {
        userToken: usertoken,
        number: number,
        password: password
      };
      //手动显示加载框
      utils.wxShowLoading("请稍候...", true);
      utils.netRequest(apiUrl, params, function(res) {
        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();

        that.setData({
          hidden: true,
        })
        wx.showToast({
          title: '绑定成功',
        })
        //延迟0.5秒跳转至上个页面
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 500);

        // that.requestcartsList(false)
      }, function(res) {
        wx.showToast({
          title: res.error,
          icon: 'none'
        })
      }, 'GET');

    }
  },

})