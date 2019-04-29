// pages/index/recommend_list/recommend.js
//获取应用实例
const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js'); //string 转HTML
const utils = require("../../../utils/util.js");
const common = require("../../../utils/common.js");
const enums = require("../../../utils/enums.js");
const datas = require("../../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true, //是否隐藏文章
    Id: "",
    Sign: "",
    Img: "",
    Contents: "",
    Reads: "",
    Time: "",
    Likes: "",
    Pull: "",
    CommentNum: "",
    collectioncount: 0,
    shareObj: null, //分享对象
    title: "", //默认分享标题
    imageUrl: "", //分享默认图片
    path: "", //默认跳转路径
    showSkeleton: true,
    webSrc: "",

    navcontent: "快速导航",
    nav_icon: "<<",
    rpxR: 1,
    animationData: {},
    animationData2: {}
  },


  nav_toindex: function() {
    wx.switchTab({
      url: "/pages/index2/index",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  nav_togoods: function() {
    wx.switchTab({
      url: "/pages/goods2/list/list",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  nav_tonews: function() {
    wx.switchTab({
      url: "/pages/news/list/list",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  nav_touser: function() {
    wx.switchTab({
      url: "/pages/user/center/center",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  nav_move: function() {
    var that = this;
    if (that.data.navcontent == "快速导航") {
      that.setData({
        navcontent: "收起",
        nav_icon: ">>"
      })
      that.translateX()
    } else {
      that.setData({
        navcontent: "快速导航",
        nav_icon: "<<"
      })
      that.animation.translateX(0).step({
        duration: 200
      })

      that.setData({
        animationData: that.animation.export()
      })
    }

  },
  translateX: function() {
    // 先旋转后放大
    // this.animation.translateX(0).step()

    this.setData({
      invoicehidden: false
    })
    this.animation.translateX(-400 / this.data.rpxR).step({
      duration: 200
    })

    this.setData({
      animationData: this.animation.export()
    })
  },

  /**
   * 获取资讯详情
   * sign 资讯标识
   */
  getNewsData: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/article/ArticleData";
    var paramrData = {
      id: that.data.Id
    }
    //显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    //网络请求数据
    // utils.netRequest(apiUrl, paramrData, function(res) {
      var res = datas.newsdetail
      var news = res.data;
      var time = news.time.substring(0, news.time.lastIndexOf(' '));
    console.log(news.contents)
      that.setData({
        Id: news.id,
        Sign: news.sign,
        title: news.title,
        Img: news.img,
        imageUrl: news.img, //分享默认图片
        Contents: news.contents,
        Reads: news.reads,
        Time: time,
        Likes: news.likes,
        Pull: news.pull,
        CommentNum: news.commentNum,
        collectioncount: news.collectioncount,
        webSrc: app.globalData.webUrl + "/article/show?id=" + news.id
      })
      // common.getShareData(enums.shareType.Article, that.data.Id, that, function (res) {
      //   that.setData({
      //     shareObj: res
      //   })
      // })
      //设置分享内容
      var obj = new Object({
        title: news.title + "-资讯详情",
        path: utils.getCurrentPageUrl(),
        imageUrl: that.data.imageUrl
      });
      that.setData({
        shareObj: obj
      });

      WxParse.wxParse('contents', 'html', news.contents, that, 0);
      //
      setTimeout(function() {
        that.setData({
          hidden: false, //是否隐藏文章内容
          showSkeleton: false
        });
      }, 200);
      //隐藏加载款
      if (isShowLoading) utils.wxHideLoading();
    // }, null, "GET");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取参数
    that.setData({
      Id: options.id,
    });

    that.loadingData(true);
    //that.getNewsData(true);
  },

  loadingData: function(isShowLoading) {
    var that = this;
    //请求获取资讯内容
    if (app.globalData.isLogin) {
      that.getNewsData(isShowLoading);
    } else {
      app.checkSession();
      app.updateUserInfoCallback=res=>{
        that.getNewsData(isShowLoading);
      }
    } 
    //设置当前页面路径
    that.setData({
      path: "/" + utils.getCurrentPageUrl()
    })
    console.log("currentUrl=" + that.data.path)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: clientHeight,
          rpxR: rpxR
        });
      }
    });
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.rotate(0).step()

    this.setData({
      animationData: animation.export()
    })

    setTimeout(function() {
      animation.translate(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)
    //获取分享数据
  },

  /**0
   * 只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮
   * 用户点击转发按钮的时候会调用
   * 此事件需要 return 一个 Object，用于自定义转发内容
   */
  onShareAppMessage: function(options) {
    var that = this;
    console.log(that.data.shareObj)
    return utils.shareAppMessage(that.data.shareObj, null);
  },

})