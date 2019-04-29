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
    interval: 5000,
    duration: 1000,
    color: "#eee",
    activecolor: "#f60",
    showSkeleton: true,
    title: "", //默认分享标题
    imageUrl: "", //分享默认图片
    path: "", //默认跳转路径,
    shareObj: null, //分享对象
    inforList: null, //公告数据
    requestCount: 0, //区块数据请求
    dataHidden: true,
    nodataHidden: true,
  },

  onLoad: function() {
    var that = this;
    // that.loadingData(true);
    // var url = "/pages/news/list/list";
    // console.log("===", url.indexOf("id") > 0)

  },

  onShow: function() {
    var that = this;
   
    that.loadingData(true);


  },
  /**
   * 加载数据
   */
  loadingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.getAdDataById();
    } else {
      app.checkSession();
      app.updateUserInfoCallback = res => {
        that.getAdDataById();
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


  // 禁止公告轮播图的手动滑动
  stopTouchMove: function() {
    return false;
  },


  // 获取区块数据
  getAdDataById: function() {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/Block/GetBlockData";
    // var usertoken = utils.getStorageSync("userToken");
    // var token = app.globalData.initToken;
    var id = "2018110512011762cf80,201809141747451cda3f,20181026170304d546f5,2018091417472354327d"
    var params = {
      ids: id
    };
    //手动显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function(res) {
      // var list = res.data

      var list=datas.index.data
      if (list && list.length > 0) {

        for (var i = 0; i < list.length; i++) {
          switch (list[i].id) {
            //头部轮播区块
            case '2018110512011762cf80':
             
              that.setData({
                topList: list[i].list,
                // topList: [],
              })
              break;
            //头部菜单选项
            case '201809141747451cda3f':
              that.setData({
                menuList: list[i].list,
              })
              break;
            //公告区块
            case '20181026170304d546f5':
              if(list[i].list.length > 0){
                that.setData({
                  inforList: list[i].list,
                })
              }else{
                that.setData({
                  inforList: [{
                    url: "",
                    title: "暂无公告"
                  }]
                });
              }
              break;
              //商品列表块
            case '2018091417472354327d':
              that.setData({
                prouctList: list[i].list,
              })
              break;
          }
        }
        that.setData({
          dataHidden: false,
          showSkeleton: false,
        });
        //显示导航栏
        wx.showTabBar();
      }
    }, function(res) {
      that.setData({
        nodataHidden: false,
      });
    // }, 'POST');
  },

  searchinput: function(e) {
    // console.log(e.detail.value)
    // this.setData({
    //   input: e.detail.value
    // })
    wx.navigateTo({
      url: '/pages/goods2/search/search',

    })
  },

  onShareAppMessage: function(options) {
    var that = this;
    //设置分享内容
    var obj = new Object({
      title: "首页-" + app.globalData.company,
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