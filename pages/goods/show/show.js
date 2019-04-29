// pages/goods/goodDetail/goodDetail.js

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
    id: 0,
    imgUrls: [
      'https://img.yzcdn.cn/upload_files/2017/10/14/FqQjYvrMCmHer35fdftrLSiXv95o.png?imageView2/2/w/750/h/0/q/75/format/webp',
      'https://img.yzcdn.cn/upload_files/2017/10/14/FmWDGgQtkeNh8pLbZMXJAGc9BQHy.png?imageView2/2/w/750/h/0/q/75/format/webp'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    color: "#eee",
    activecolor: "#f60",
    goodlist: null,
    showModalStatus: false, //是否显示
    typeid: 1,
    num: 1, //初始数量,
    detail: null,
    shareObj: null, //分享对象
    title: "", //默认分享标题
    imageUrl: "", //分享默认图片
    path: "", //默认跳转路径,
    isIPX: false,
    showSkeleton: true,


    navcontent: "快速导航",
    nav_icon: "<<",
    rpxR: 1,
    animationData: {},
    animationData2: {},
    winHeight:0
  },


  nav_toindex: function () {
    wx.switchTab({
      url: "/pages/index2/index",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  nav_togoods: function () {
    wx.switchTab({
      url: "/pages/goods2/list/list",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  nav_tonews: function () {
    wx.switchTab({
      url: "/pages/news/list/list",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  nav_touser: function () {
    wx.switchTab({
      url: "/pages/user/center/center",
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  nav_move: function () {
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
  translateX: function () {
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


  onLoad: function(options) {
    var that = this;


    if (app.globalData.isIPX == 1) {
      // console.log(213213213213)
      that.setData({
        isIPX: true
      })
    }

    // console.log(options);
    var id = options.id;

    // var goodlist = datas.goodlist.data;
    // var detail = datas.goodshow.data
    that.setData({
      // goodlist: goodlist,
      id: id,
      path: "/" + utils.getCurrentPageUrl(),
      // title: app.globalData.company
      // detail: detail
    })

    // that.loaddingData(true);
  },
  onShow: function() {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
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

    setTimeout(function () {
      animation.translate(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)

    this.loaddingData(true);
  },


  
  onShareAppMessage: function(options) {
    var that = this;
    //返回分享对象
    return utils.shareAppMessage(that.data.shareObj, function(res) {
      // console.log(res);
    });
  },
  todetail: function(e) {
    var that=this;
 
    var path = that.data.path
    console.log("传输的路径："+path)
    wx.navigateTo({
      url: '/pages/goods/detail/detail?status=' + e.currentTarget.dataset.status + "&id=" + e.currentTarget.dataset.id+"&path="+path,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  account: function() {
    var that = this;
    var arr = [];
    arr[0] = new Array();
    arr[1] = new Array();
    arr[2] = new Array();
    arr[3] = new Array();
    arr[4] = new Array();
    arr[5] = new Array();
    arr[6] = new Array();
    var detail = this.data.detail



    // arr.push(detail[a].id)




    arr[0].push(detail.id) //商品id
    arr[1].push(that.data.num) //商品数量
    arr[2].push(detail.price) //商品单价
    arr[3].push(detail.postage) //邮费
    arr[4].push(detail.title) //商品名称
    arr[5].push(detail.imgUrls[0]) //商品名称
    arr[6][0] = false
    // cartData[carts[a].id] = carts[a].count;




    utils.setStorageSync("paycar", arr);


    // console.log(arr)
    // console.log(cartData)

    wx.navigateTo({
      url: "/pages/account/account",
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // var index=this.data.index

    // console.log(carts)


  },
  tocart: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    // console.log(id)
    var apiUrl = app.globalData.webUrl + "/MallProduct/ShopCar";
    var usertoken = utils.getStorageSync("userToken");
    var id = id;
    var params = {
      pId: id,
      usertoken: usertoken,
      count: that.data.num
    };
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function(res) {
      utils.wxshowToast("加入购物车成功", "success", 1000, null)
      //手动关闭加载提示
      // utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();


      // that.cart(true);
    }, function() {
      utils.wxshowToast("加入购物车失败", "none", 1000, null)
    }, 'GET');

  },

  bindManual: function(e) {
    // console.log(e.detail.value)
    this.setData({
      num: e.detail.value
    })
  },

  // tocart:function(e){
  //     console.log(this.data.num)
  // },
  /**
   * 生命周期函数--监听页面加载
   */


  loaddingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.getProductDetail(isShowLoading);
      that.getRecommend(isShowLoading);

    } else {
      app.checkSession();
      app.updateUserInfoCallback = res => {
        that.getProductDetail(isShowLoading);
        that.getRecommend(isShowLoading);
      }
    }

  },
  /**
   * 获取商品的详情信息
   */
  getProductDetail: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/MallProduct/GetMallProduct";
    var id = that.data.id;
    var params = {
      id: id
    };
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);

    // utils.netRequest(apiUrl, params, function(res) {

      // console.log(21321321930218)
      // console.log(res)
      // var list = res.data;
      var list = datas.product.data;
      var image = list.imgUrls[0];
      if (image) {
        image = image.replace(/(^\s*)|(\s*$)/g, "");
      } else {
        image = ""
      }
      that.setData({
        detail: list,
        title: list.title,
        imageUrl: image,

      });
      setTimeout(() => {
        that.setData({
          hidden: false,
          showSkeleton: false,
        })
      }, 500)


      // console.log(image)
      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();

      // common.getShareData(enums.shareType.Article, app.globalData.initToken, that, function (res) {
      //   that.setData({
      //     shareObj: res
      //   })
      //   console.log("--分享信息 start--");
      //   console.log(res);
      //   console.log("--分享信息 end--");
      // });
      //设置分享内容
      var obj = new Object({
        title: that.data.title + app.globalData.company,
        path: "/pages/goods/show/show",
        imageUrl: image
      });
      that.setData({
        shareObj: obj
      });
    }, function(res) {
      var data = {
        "id": 0,
        "title": "",
        "price": 0,
        "postage": 0,
        "count": 0,
        "sale": 0,
        "weight": "",
        "imgUrls": [],
        "descs": ""
      }
      that.setData({
        detail: data
      })
      wx.showToast({
        title: '该商品已下架',
        duration: 2000,
        icon: "none"
      })
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)

    // }, 'GET');
  },
  // 获取更多精选商品
  getRecommend: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/MallProduct/GetRecommend";
    // var usertoken = utils.getStorageSync("userToken");
    var id = that.data.id;
    var params = {
      curPid: id
    };
    //手动显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function(res) {
      // var list = res.data;
      var list = datas.otherproduct.data;
      that.setData({
        goodlist: list
      });
      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
  },


  /* 点击减号 */
  bindMinus: function() {
    // console.log(23412421412)

    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    // console.log(num)
  },



  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    // console.log(num)
  },

  //显示对话框
  showModal: function(e) {
    var that = this;
    var typeid = e.currentTarget.dataset.typeid;
    that.setData({
      typeid: typeid
    })
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },



})