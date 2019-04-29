//获取应用实例
const app = getApp();
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js")
Page({
  data: {

    GiftList: null,
    hasMore: true,
    hasRefesh: false,
    hidden: true,
    isHasData: true, //默认有数据
    index: 0, //选项卡当前默认选中第一个
    pageNo: 1,
    type: 1,
    windowHeight: "", //窗口高度,
    ishasGiftList: true, //默认显示卡券列表数据
    open: false,
    giftList: null, //可用
    IdDatalist: {}, //id
    isIPX: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //网络请求数据
    wx.getSystemInfo({
      success: function(res) {
        // 获取可使用窗口高度
        console.log(res.windowHeight)
        //将高度乘以换算后的该设备的rpx与px的比例
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));
        //最后获得转化后得rpx单位的窗口高度
        console.log(windowHeight)
        that.setData({
          windowHeight: windowHeight
        });

      }
    });
    //加载页面数据
    that.loadingData(true);
    // 判断是设备是否是iphoneX
    if (app.globalData.isIPX == 1) {
      that.setData({
        isIPX: true
      })
    }
  },

  onShow: function(options) {
    var that = this;
    that.loadingData(true);
  },
  /**
   * 加载数据
   */
  loadingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      //获取用户信息\轮播图\积分数据
      that.requestGiftList(isShowLoading);

    } else {
      app.updateUserInfoCallback = res => {
        //获取用户信息\轮播图\积分数据
        that.requestGiftList(isShowLoading);

      }
    }
  },
  /**
   * 加载选项卡切换时加载数据
   */
  loadingGiftList: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.requestGiftList(isShowLoading);
    } else {
      app.updateUserInfoCallback = res => {
        that.requestGiftList(isShowLoading);
      }
    }
  },
  // 点击查看卡详细信息
  detail: function(e) {
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    var that = this;
    var IdDatalist = that.data.IdDatalist;
    IdDatalist[id] = !IdDatalist[id]
    that.setData({
      IdDatalist: IdDatalist
    })
  },
  /**
   * 切换选项卡
   */
  changeTabbar(e) {
    var that = this;
    // console.log(e);
    var current = e.target.dataset.current;
    var type = e.target.dataset.type;
    // console.log(status);
    if (that.data.index === current) {
      return false;
    } else {
      that.setData({
        index: current,
        type: type,
        ishasGiftList: true
      })
    }
    that.loadingGiftList(true);
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {
    var that = this;
    // console.log(e);
    // console.log(e.detail.current);
    that.setData({
      index: e.detail.current,
      type: e.detail.current + 1,
      ishasGiftList: true
    });
    // console.log(that.data.status);
    that.loadingGiftList(true);
  },

  /**
   * 获取卡券列表信息
   */
  requestGiftList: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/getgiftCardlist";
    var pageNo = that.data.pageNo;
    var type = that.data.type;
    var userToken = utils.getStorageSync("userToken");
    var params = {

      type: type,
      userToken: userToken
    };
    if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // 发起网络请求
    // utils.netRequest(apiUrl, params, function (res) {//成功领取回调 



        var res = datas.giftcard
        var list = res.data;
        // var list = datas.giftList.data; //datas构造的静态数据
        var giftList = []; //存放可用的卡
        // var nowDate = new Date().getTime(); //获取当前的时间戳
        var IdDatalist = {};
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            IdDatalist[item.id] = false; //开始默认全部为false
            //var date = new Date(item.expiredtime).getTime(); //将日期转换为时间戳
            var obj = new Object({
              id: item.id,
              balance: item.balance / 100,
              descs: item.descs,
              img: item.img,
              //expiredtime: utils.formatUTCTime(date / 1000, 'Y-M-D'), //转换的对象单位是秒
              expiredtime: item.expiredtime.substring(0, item.expiredtime.lastIndexOf(' ')),
              title: item.title,
              num: item.number,
              price: item.price / 100
            });
            giftList.push(obj);
          }
        }
        that.setData({
          giftList: giftList,
          IdDatalist: IdDatalist,
          ishasGiftList: false,
        });
        // 手动关闭加载提示
        if (isShowLoading) utils.wxHideLoading();
        //手动显示底部导航栏
        wx.showTabBar();
        //手动停止刷新
        wx.stopPullDownRefresh();
      },
      function(res) {
        if (res.error) utils.wxshowToast(res.error);
      // }, "GET", false);
  },

  //添加新卡
  toAddcard: function(e) {
    wx.navigateTo({
      url: '/pages/user/addcard/addcard',
    })
  },
  toUse: function() {
    wx.switchTab({
      url: '/pages/goods2/list/list',
    })
  }

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {
  //   // console.log("下拉刷新...");
  //   var that = this;
  //   //网络请求数据
  //   that.setData({
  //     pageNo: 1,
  //     hasRefesh: true,
  //     hidden: false
  //   });
  //   //网络请求数据
  //   // that.requestGiftList(false);
  // },
  /**
   * 页面上拉触底事件的处理函数
   */
  // lower: function() {
  //   // console.log("上拉翻页...");
  //   var that = this;
  //   //如果页面变量 hasMore 为 true，才执行翻页加载数据
  //   if (that.data.hasMore) {
  //     var nextPage = that.data.pageNo + 1;
  //     // console.log("页码：" + nextPage);
  //     that.setData({
  //       pageNo: nextPage,
  //     })
  //     //网络请求数据
  //     // that.requestGiftList(false);
  //   }

  // },
})