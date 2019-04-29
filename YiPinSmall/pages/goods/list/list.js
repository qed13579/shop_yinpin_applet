// pages/goods/list/list.js
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: null,
    // goodlist: [],
    pageNo: 1,
    hasMore: true,
    hasRefesh: false,
    hidden: true,
    isHasData: true, //默认有数据
    // menu: [],
    hasList:false,
    carts:[],
    show: false,
    showSkeleton: true,
    title: "",//默认分享标题
    imageUrl: "",//分享默认图片
    path: "",//默认跳转路径,
    shareObj: null,//分享对象
    menu: {
      "error_code": 0,
      "error": "",
      "data": [
        {
          "id": 4,
          "title": "花蜜"
        },
        {
          "id": 3,
          "title": "杂粮"
        },
        {
          "id": 2,
          "title": "小米"
        },
        {
          "id": 1,
          "title": "味稻"
        }
      ]
    },
    goodlist:

    {
      "error_code": 0,
      "error": "",
      "data": {
        "list": [
          {
            "id": 1,
            "title": "五常稻花香试吃装每袋只要1分钱（快递费9.9元限量每ID1袋）",
            "img": "https://img.yzcdn.cn/upload_files/2017/12/23/Fskx_JANwBp5RZSOgbBD7Zbx20t6.png?imageView2/2/w/750/h/0/q/75/format/webp",
            "price": 1,
            "descs": "",
            "Monthly": 5,
            "discount": ""
          },
          {
            "id": 3,
            "title": "五常稻花香试吃装每袋只要1分钱（快递费9.9元限量每ID1袋）",
            "img": "https://img.yzcdn.cn/upload_files/2017/12/23/Fskx_JANwBp5RZSOgbBD7Zbx20t6.png?imageView2/2/w/750/h/0/q/75/format/webp",
            "price": 1,
            "descs": "五常稻花香试吃装每袋只要1分钱（快递费9.9元限量每ID1袋）",
            "Monthly": 4,
            "discount": ""
          },
          {
            "id": 5,
            "title": "忆品良田鸭稻米稻田养鸭生态自然",
            "img": "https://img.yzcdn.cn/upload_files/2017/11/22/FvUqJtJjYqpjoLSDJSypfyvrcsO2.png?imageView2/2/w/730/h/0/q/75/format/webp",
            "price": 158,
            "descs": "忆品良田鸭稻米 稻田养鸭生态自然",
            "Monthly": 3,
            "discount": ""
          },
          {
            "id": 7,
            "title": "忆品良田五常珍品大米---致优5公斤",
            "img": "https://img.yzcdn.cn/upload_files/2017/10/14/Fl9BHe1o7Cr1U1-tcf_6D_xeJA8o.png?imageView2/2/w/750/h/0/q/75/format/webp",
            "price": 109,
            "descs": "",
            "Monthly": 1,
            "discount": ""
          }
        ],
        "page": 1,
        "totalcount": 4,
        "totalpage": 1
      }
    }
  },

  // addToCart() {
  //   const self = this;
  //   self.setData({
  //     show: true
  //   })
  //   setTimeout(function () {
  //     self.setData({
  //       show: false,
   
  //     })
  //   }, 300)

  // },

  // cart: function (isShowLoading) {
  //   var that = this;
  //   var apiUrl = app.globalData.webUrl + "/MallProduct/ShopCarList";
  //   var usertoken = utils.getStorageSync("userToken");
  //   var params = { usertoken: usertoken };

  //   if (isShowLoading) utils.wxShowLoading("请稍候...", true);
  //   utils.netRequest(apiUrl, params, function (res) {
  //     console.log(666666666666666)
  //     console.log(res)
  //     var list = res.data;
  //     // var list = datas.cart.data.list;

  //     if (list == "") {
  //       that.setData({
  //         hasList: false
  //       })
  //     }
  //     that.setData({

  //       carts: list
  //     });
  //     //手动关闭加载提示
  //     if (isShowLoading) utils.wxHideLoading();
  //     //手动停止刷新
  //     wx.stopPullDownRefresh();
  //   }, null, 'GET');
  // },




  tocart:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    // console.log(id)
    var apiUrl = app.globalData.webUrl + "/MallProduct/ShopCar";
    var usertoken = utils.getStorageSync("userToken");
    var id = id;
    var params = { pId: id, usertoken: usertoken, count:1};
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function (res) {
      utils.wxHideLoading();
      utils.wxshowToast("加入购物车成功", "success", 1000, null) 

      //手动关闭加载提示

      //手动停止刷新
      // wx.stopPullDownRefresh();
      // that.cart(true);
    }, function(){
      utils.wxshowToast("加入购物车失败", "none", 1000, null) 
    }, 'GET');


    // that.setData({
    //   show: true
    // })
    // setTimeout(function () {
    //   that.setData({
    //     show: false,

    //   })
    // }, 1000)

  },



  gotocart:function(e){
    wx.navigateTo({
      url: "/pages/cart/cart",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  switchCategory: function (e) {
    var that = this;

    var index = e.currentTarget.dataset.index;
    that.setData({
      curIndex: index
    })
    // console.log(e.currentTarget.dataset.index)
    that.requestDataList(true);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用方法传相应参数
    that.loadingDatatop(false);

  },
  togoodshow: function (e) {
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/show/show?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onShow: function () {
   
  },
  loadingDatatop: function (isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.styleList(isShowLoading);
      // that.cart(isShowLoading);


    } else {
      app.updateUserInfoCallback = res => {
        that.styleList(isShowLoading);
        // that.cart(isShowLoading);
      }

    }

  },
  styleList: function (isShowLoading){

      var that = this;
      var apiUrl = app.globalData.webUrl + "/MallProduct/GetMallProductType";
      var usertoken = utils.getStorageSync("userToken");
      var params = {};
      //手动显示加载框
      if (isShowLoading) utils.wxShowLoading("请稍候...", true);





      utils.netRequest(apiUrl, params, function (res) {


        var list = res.data;
        that.setData({
          curIndex: res.data[0].id,
          menu: list,
          
        });
        //手动关闭加载提示
        if (isShowLoading) utils.wxHideLoading();

        that.requestDataList(isShowLoading);


        //手动停止刷新
        // wx.stopPullDownRefresh();
      }, null, 'GET');
   

  },
  requestDataList: function (isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/MallProduct/GetMallProductList";
    // var pageNo = that.data.pageNo;
    // var usertoken = utils.getStorageSync("userToken");
    // var token = app.globalData.initToken;
    var params = { id: that.data.curIndex};
    //手动显示加载框

    if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function (res) {
      // console.log(212321321)
      // console.log(res)
    var data = res.data.list;
    // var data = datas.goodslist.data.list
    // var res = datas.goodslist
    that.setData({
    showSkeleton: false
    })
    // console.log(data)
    var list = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        var obj = new Object({
          "img": item.img,
          "title": item.title,
          "money": item.price,
          "id": item.id,
          "discount": item.value,
      
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
    // wx.stopPullDownRefresh();
    }, null, "GET");

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
    // wx.stopPullDownRefresh();
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
    var that = this;
    //设置分享内容
    var obj = new Object({
      title: "商品-忆品良田开饭咯",
      path: utils.getCurrentPageUrl(),
      imageUrl: ""
    });
    that.setData({
      shareObj: obj
    });
    //返回分享对象
    return utils.shareAppMessage(that.data.shareObj, function (res) {
      // console.log(res);
    });
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
  // onPullDownRefresh: function () {
  //   setTimeout(() => {
  //     var that = this;
  //     that.loadingDatatop();
  //     // 数据成功后，停止下拉刷新
  //     wx.stopPullDownRefresh();
  //   }, 1000);

  // }

})