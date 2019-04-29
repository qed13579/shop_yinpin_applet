// page/component/index.js
//获取应用实例
const app = getApp();
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const common = require("../../../utils/common.js");
const enums = require("../../../utils/enums.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageNo: 1,
    hasMore: true,
    hasRefesh: false,
    hidden: true,
    isHasData: true,
    shareObj: null, //分享对象
    title: "", //默认分享标题
    imageUrl: "", //分享默认图片
    path: "", //默认跳转路径,
    showSkeleton: true
  },
  //监听页面加载
  onLoad: function(options) {
    var that = this;
    // var list = datas.articleList.list;

    // that.setData({
    //   list: list
    // })
    that.loadingData(true);
    //that.requestDataList(true);
  },
  /**
   * 
   */
  onShow: function(options) {
    var that = this;
    //that.loadingData(false);
    //this.test();
  },
  /**
   * 加载数据
   */
  loadingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.requestDataList(isShowLoading);

    } else {
      app.checkSession();
      //走完授权登录流程后，执行首页数据加载
      app.updateUserInfoCallback = res => {
        that.requestDataList(isShowLoading);

      }
    }
    //设置当前页面路径
    that.setData({
      path: "/" + utils.getCurrentPageUrl()
    });
    //获取后台配置的分享对象
    // common.getShareData(enums.shareType.Article, app.globalData.initToken, that, function (res) {
    //   that.setData({
    //     shareObj: res
    //   })
    //   console.log("--分享信息 start--");
    //   console.log(res);
    //   console.log("--分享信息 end--");
    // });

  },
  // 网络请求获取资讯列表
  requestDataList: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/Article/ArticleList";
    var pageNo = that.data.pageNo;
    var params = {
      page: pageNo,
    };
    // console.log("isShowLoading=" + isShowLoading)
    //手动开启
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    //发起请求
    // utils.netRequest(apiUrl, params, function(res) {
      var res = datas.news
      var list = res.data.list;
      var listData = [];
      for (var i = 0; i < list.length; i++) {
        var item = new Object({
          id: list[i].id,
          sign: list[i].sign,
          targettype: list[i].targettype,
          time: list[i].time.substring(0, list[i].time.lastIndexOf(' ')),
          title: list[i].title,
          img: list[i].img
        });
        listData.push(item);
      }

      // page 等于 1 表示首次加载或下拉刷新
      if (res.data.page == 1) {
        that.setData({
          list: listData,
        });

        // isHasData 默认是 false，即显示，
        // 只在第一次加载数据的时候，
        // 根据有无数据改变值，翻页不做改变
        if (list.length == 0) {
          that.setData({
            isHasData: false //显示无数据提示的图片
          })
        }
      } else {
        that.setData({
          list: that.data.list.concat(listData),
        });
      }
      //如果数据列表等于 0，或返回页面数等于总页码数，则显示没有更多内容
      if (list.length == 0 || res.data.page == res.data.totalpage) {
        that.setData({
          hasMore: false,
        })
      }
      setTimeout(function() {
        that.setData({
          // hasRefesh: false,
          hidden: false,
          showSkeleton: false
        });
      }, 200)
      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动显示底部导航栏
      wx.showTabBar();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, "GET");

  },
  // 点击资讯列表项跳转
  showDetail: function(dom) {
    var sign = dom.currentTarget.dataset.sign;
    var id = dom.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/news/show/show?id=" + id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    console.log("下拉刷新...");
    //网络请求数据
    that.setData({
      pageNo: 1,
      hasRefesh: true,
      hidden: false
    });
    that.loadingData(false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  onReachBottom: function() {
    console.log("上拉翻页...");
    var that = this;
    //如果页面变量 hasMore 为 true，才执行翻页加载数据
    if (that.data.hasMore) {
      var nextPage = that.data.pageNo + 1;
      console.log("页码：" + nextPage);
      that.setData({
        pageNo: nextPage,
      })
      //网络请求数据
      that.loadingData(true);
    }

  },
  /**
   * 只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮
   * 用户点击转发按钮的时候会调用
   * 此事件需要 return 一个 Object，用于自定义转发内容
   */
  onShareAppMessage: function(options) {
    var that = this;
    //设置分享内容
    var obj = new Object({
      title: "资讯-" + app.globalData.company,
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
  //页面滚动触发事件的处理函数
  onPageScroll: function() {

  },

  //测试接口代码
  test: function() {
    wx.request({
      url: app.globalData.webUrl + "/game/kicklist",
      data: {
        token: '087750b72dc22af8'
      }, // 类型： Object/String/ArrayBuffer
      header: {
        'content-type': 'application/x-www-form-urlencoded' //'application/json' // 默认值
      },
      method: 'GET', // GET POST 需大写
      success: res => {
        console.log('--执行成功回调--')
        console.log(res);
      },
      fail: res => {
        console.log('--执行失败回调--')
        console.log("error_code=" + res.error_code + ",error=" + res.error);
      }
    })
  }

})