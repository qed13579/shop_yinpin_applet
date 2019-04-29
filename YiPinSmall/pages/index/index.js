//index.js
//获取应用实例
const app = getApp()
const datas = require("../../utils/data.js");
const utils = require("../../utils/util.js");
const common = require("../../utils/common.js");
const enums = require("../../utils/enums.js");
Page({
  data: {
    topList: null,
    menuList: null,
    prouctList: null,
    contentList: null,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    interval: 2000,
    duration: 1000,
    color: "#eee",
    activecolor: "#f60",
    showSkeleton: true,
    title: "", //默认分享标题
    imageUrl: "", //分享默认图片
    path: "", //默认跳转路径,
    shareObj: null, //分享对象
    hidden: false,
  },

  onLoad: function() {
    var that = this;
    that.setData({
      topList: datas.topList.data,
      menuList: datas.menuList.data,
      contentList: datas.menuList.data,
      prouctList: datas.menuList.data
    })

    console.log(app.globalData.company)
    that.setData({
      path: "/" + utils.getCurrentPageUrl(),
      title: app.globalData.company
    })
    that.loadingData(true);
    var url = "/pages/news/list/list";
    console.log("===", url.indexOf("id") > 0)
  },
  /**
   * 加载数据
   */
  loadingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.getData();
    } else {
      app.updateUserInfoCallback = res => {

        that.getData();
      }
    }

    // common.getShareData(enums.shareType.Article, app.globalData.initToken, that, function (res) {
    //   that.setData({
    //     shareObj: res
    //   })
    //   console.log("--分享信息 start--");
    //   console.log(res);
    //   console.log("--分享信息 end--");
    // });
  },

  getData: function() {
    var that = this;
    //头顶轮播图的数据
    that.getAdDataById("20180914174805797989", function(list) {
      that.setData({
        topList: list
      })
    })
    //菜单数据
    that.getAdDataById("201809141747451cda3f", function(list) {
      that.setData({
        menuList: list
      })
    })
    //中间大图数据
    that.getAdDataById("20180914174734815515", function(list) {
      that.setData({
        contentList: list
      })
    })
    //商品图数据
    that.getAdDataById("2018091417472354327d", function(list) {
      that.setData({
        prouctList: list
      })
    })
  },

  // 获取区块数据
  getAdDataById: function(id, callback, errorCallback) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/Block/GetAdData";
    var usertoken = utils.getStorageSync("userToken");
    var token = app.globalData.initToken;
    var params = {
      id: id
    };
    //手动显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function(res) {
      var list = res.data
      // var list = [];
      callback(list);
      that.setData({
        showSkeleton: false,
      })

    }, function(res) {
      // var list = res.data;
      // if (list = null) {
      //   that.setData({
      //     hidden: true,
      //     showSkeleton: false,
      //   })
      // }
      // errorCallback(res);
    }, 'GET');
  },

  onShareAppMessage: function(options) {
    var that = this;
    //设置分享内容
    var obj = new Object({
      title: "首页-忆品良田开饭咯",
      path: utils.getCurrentPageUrl(),
      imageUrl: ""
    });
    that.setData({
      shareObj: obj
    });
    //返回分享对象
    return utils.shareAppMessage(that.data.shareObj, function(res) {
      console.log(res);
    });
  },

  // onPullDownRefresh:function(){
  //   setTimeout(() => {
  //     var that = this;
  //     that.loadingData();
  //     // 数据成功后，停止下拉刷新
  //     wx.stopPullDownRefresh();
  //   }, 1000);

  // }

})