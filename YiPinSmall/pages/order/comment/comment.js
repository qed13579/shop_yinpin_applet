// pages/order/comment/comment.js
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    flag: 5,
    sourceid: 0,
    typestr: 0,
    contents: "",
    id: null,
    orderid: null,
  },


  // getImgUrlsDate: function (isShowLoading) {
  //   var that = this;
  //   var apiUrl = app.globalData.webUrl + "/user/UserData";
  //   var usertoken = utils.getStorageSync("userToken");

  //   var params = {
  //     usertoken: usertoken
  //   };
  //   //手动显示加载框
  //   if (isShowLoading) utils.wxShowLoading("请稍候...", true);
  //   utils.netRequest(apiUrl, params, function (res) {
  //     var list = res.data;
  //     that.setData({
  //       list: list
  //     });
  //     //手动关闭加载提示
  //     if (isShowLoading) utils.wxHideLoading();
  //     //手动停止刷新
  //     wx.stopPullDownRefresh();
  //   }, null, 'GET');
  // },





  formsubmit: function (e) {
    var that = this;
    console.log("111111", e.detail.value.content)
    var apiUrl = app.globalData.webUrl + "/user/Commnet";
    var usertoken = utils.getStorageSync("userToken");
    var sourceid = that.data.id;
    var orderid = that.data.orderid;
    var contents = e.detail.value.content;



    console.log(contents)
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);

    if (contents != undefined && contents != '' && contents != null) {
      var params = {
        usertoken: usertoken,
        wxorderid: orderid,
        sourceid: sourceid,
        type: 1,
        contents: contents
      };
      utils.netRequest(apiUrl, params, function (res) {
        var list = res.data;

        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '评价成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1,
        })
       
        // that.getImgUrlsDate(false);
      }, null, 'GET');
      
    } else {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        duration: 2000
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      orderid: options.orderid,
      img: options.img,
      title: options.title,
    })
    // this.getImgUrlsDate(false);
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
    //that.loadingDatatop(false);
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
   * 提交评论 
   */
  postCommentData: function (usertoken, sourceid, typestr, contents) {
    if (!usertoken) {
      utils.wxshowToast("当前用户未登录！");
    } else if (!sourceid) {
      utils.wxshowToast("无法获取评论对象Id！");
    } else if (!typestr) {
      utils.wxshowToast("无法获取评论对象type！");
    } else if (!contents) {
      utils.wxshowToast("请输入评论内容！");
    } else {
      var params = {
        usertoken: usertoken,
        sourceid: sourceid,
        typestr,
        contents: contents
      };
      utils.netRequest(apiUrl, params, function (res) {

      });
    }

  },


  changeColor1: function () {
    var that = this;
    that.setData({
      flag: 1
    });
    console.log(that.data.flag)
  },
  changeColor2: function () {
    var that = this;
    that.setData({
      flag: 2
    });
    console.log(that.data.flag)
  },
  changeColor3: function () {
    var that = this;
    that.setData({
      flag: 3
    });
    console.log(that.data.flag)
  },
  changeColor4: function () {
    var that = this;
    that.setData({
      flag: 4
    });
    console.log(that.data.flag)
  },
  changeColor5: function () {
    var that = this;
    that.setData({
      flag: 5
    });
    console.log(that.data.flag)
  },


})