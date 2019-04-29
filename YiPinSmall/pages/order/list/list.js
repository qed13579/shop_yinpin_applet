// pages/goods/list/list.js
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodlist: [],
    pageNo: 1,
    hasMore: true,
    hasRefesh: false,
    hidden: true,
    isHasData: true, //默认有数据
    status: 0,
    winHeight: 0,
    rpxR: 0,
    // hidden2:true
    // currentTab: 0, //预设当前项的值
  },
  tologistics: function (e) {
    console.log(e)
    var num = e.currentTarget.dataset.num
    var com = e.currentTarget.dataset.com
    wx.navigateTo({
      url: '/pages/order/logistics/logistics?num=' + num + "&com=" + com,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tocart: function (e) {
    console.log(e)

    //   var that = this;
    //   var id = e.currentTarget.dataset.id;
    //   var failitemtitle=[]
    //   var failitemimg = []
    //   // console.log(that.data.goodlist.length)

    //   for (var a = 0; a < that.data.goodlist.length;a++){
    //     console.log(that.data.goodlist[a])

    //   if (that.data.goodlist[a].id == id){
        
    //     for (var b = 0; b < that.data.goodlist[a].img.length; b++) {
         
    //       var pid = that.data.goodlist[a].img[b].id//商品的id
    //   var apiUrl = app.globalData.webUrl + "/MallProduct/ShopCar";
    //   var usertoken = utils.getStorageSync("userToken");
    
    //   var params = {
    //     pId: pid,
    //     usertoken: usertoken,
    //     count: 1
    //   };
    //   //手动显示加载框
    //   utils.wxShowLoading("请稍候...", true);
    //   utils.netRequest(apiUrl, params, function (res) {
        
    //     // utils.wxshowToast("加入购物车成功", "success", 1000, null)
    //     //手动关闭加载提示
    //     // utils.wxHideLoading();
    //     //手动停止刷新
    //     wx.stopPullDownRefresh();


    //     // that.cart(true);
    //   }, function () {
    //     utils.wxshowToast("加入购物车失败", "none", 1000, null)

    //     console.log(a)
    //     // failitemtitle.push(that.data.goodlist[a].img[b].title);
    //     // failitemimg.push(that.data.goodlist[a].img[b].img);

    //   }, 'GET');
    //     }
    //   }
      
    // }

  
  },
  toaccount: function (e) {
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/account/account',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //∫ξ
  todetail: function (e) {
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: "/pages/order/show/show?id=" + id + "&&status=" + status +"&isaccount=0",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  tocommentlist:function(e){
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: "/pages/order/commentlist/commentlist?id=" + id + "&&status=" + status,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // switchTab: function (e) {
  //   // console.log(e.detail);
  //   this.setData({
  //     // currentTab: e.detail.current,
  //     status: e.detail.current + 1,
  //     hasMore: true,
  //     pageNo: 1,
  //     filmList: [],
  //     isHasData: false,
  //     hidden: true,
  //   });
  //   console.log(this.data.status)
  //   this.loadingDatatop(true);
  // },
  toIntegralDetail: function (options) {
    var id = options.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/Integral/scoredetail/scorce?id=' + id,
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    // console.log(e);
    // var cur = e.target.dataset.current;
    var status = e.target.dataset.status;
 
      this.setData({
        // currentTab: cur,
        status: status,
        hasMore: true,
        pageNo: 1,
        filmList: [],
        isHasData: false,
        hidden: true,
      })

    
    // console.log(this.data.status)
    this.loadingDatatop(true)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: clientHeight,
          rpxR: rpxR//338
        });
        console.log("窗口的高度为：" + that.data.winHeight)
      }
    });
  },
  onShow: function () {
    var that = this;
    //调用方法传相应参数
    that.loadingDatatop(true);
  },
  loadingDatatop: function (isShowLoading) {
    var that = this;
    // if (app.globalData.isLogin) {
    that.requestDataList(isShowLoading);


    // } else {
    //   app.updateUserInfoCallback = res => {
    //     that.requestDataList(isShowLoading);


    //   }

    // }

  },
  requestDataList: function (isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/User/newGetUserWxOrder";
    var pageNo = that.data.pageNo;
    var usertoken = utils.getStorageSync("userToken");
    var status = that.data.status
  
    // var token = app.globalData.initToken;
    var params = { page: pageNo, userToken: usertoken, status: status};
    //手动显示加载框

    if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function (res) {

      if (status == 0) {
       var  res = datas.allorderlist
      }

      if (status==4){
        var res = datas.Waitingorderlist1
      }
      if (status == 5) {
        var res = datas.Waitingorderlist2
      }
      if (status == 10) {
        var res = datas.completeorederlist
      }

      if (status == 0 && pageNo==2){
        var res = datas.allorederlistpage2
      }
      // console.log(234213213)
      // console.log(res);
     
    var data = res.data.list;
    // var data = datas.orderlist.data.list
    // var res = datas.orderlist
    // console.log(data)
    var list = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var image = item.img
        // console.log(2342342343)
     
        
        var name = item.productlist[0].title
      //  console.log(21321321321)
      //  console.log(name)
        var obj = new Object({
          "img": item.productlist,
          "title": name,
          // "money": item.money,
          "status": item.status,
          "num": item.productcount,
          "id": item.id,
          "pay": item.pay,
          // "type": item.type
        });
        list.push(obj);
      }
    }
    // //如果 list 长度为 0，或翻到最后一页,则设置没有更多数据
    if (list.length == 0 || that.data.pageNo == res.data.totalpage) {
      that.setData({
        hasMore: false,
      })
    }

    // page 等于 1 表示首次加载或下拉刷新
    if (res.data.page == 1) {

      that.setData({
        goodlist: list,
      });
      // console.log(that.data.goodlist)
      // isHasData 默认是 false，即显示，
      // 只在第一次加载数据的时候，
      // 根据有无数据改变值，翻页不做改变
      if (list.length == 0) {
        that.setData({
          isHasData: false //隐藏无数据提示的图片
        })
      } else {
        that.setData({
          isHasData: true //隐藏无数据提示的图片
        })
      }
    }
    else {
      that.setData({
        goodlist: that.data.goodlist.concat(list),
      });
    }
    that.setData({
      hidden: false,
      hasRefesh: false,
    });
    //隐藏加载框
    if (isShowLoading) utils.wxHideLoading();
    //手动停止刷新
    wx.stopPullDownRefresh();
    // }, null, "GET");

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.switchTab({
      url: '/pages/user/center/center',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log("下拉刷新...");
    var that = this;
    //网络请求数据
    that.setData({
      pageNo: 1,
      hasRefesh: true,
      hidden: false,
      hasMore: true,
    });
    //网络请求数据
    that.loadingDatatop(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  lower: function () {
    // console.log("上拉翻页...");
    var that = this;
    //如果页面变量 hasMore 为 true，才执行翻页加载数据
    if (that.data.hasMore) {
      var nextPage = that.data.pageNo + 1;
      // console.log("页码：" + nextPage);

      that.setData({
        pageNo: nextPage,
      })
      //网络请求数据
      that.requestDataList(true);
    }

  },

})