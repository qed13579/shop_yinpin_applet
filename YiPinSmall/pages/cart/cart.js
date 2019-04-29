const utils = require("../../utils/util.js");
const datas = require("../../utils/data.js");
var app = getApp()
Page({
  data: {
    startX: 0, //开始坐标 
    startY: 0,
    show: true,
    status: "编辑",
    selectAllStatus: false,
    carts: [],
    index: null,
    showSkeleton: true,
    isIPX: false,
    nowdel: true,
    word: false
    // cartData:{}

  },
  togoodshow: function(e) {
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/show/show?id=' + id,
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
    var carts = this.data.carts
    var cartData = {}
    var c = 0
    for (var a = 0; a < carts.length; a++) {
      // arr.push(carts[a].id)
      if (carts[a].selected == false) {
        c++
      }
      if (carts[a].selected == true) {
        arr[0].push(carts[a].pid) //商品id
        arr[1].push(carts[a].count) //商品数量
        arr[2].push(carts[a].price) //商品单价
        arr[3].push(carts[a].postage) //邮费
        arr[4].push(carts[a].title) //商品名称
        arr[5].push(carts[a].img) //商品名称
        arr[6][0] = true
        // cartData[carts[a].id] = carts[a].count;
      }

    }
    if (c == carts.length) {

      wx.showToast({
        title: '您还没选择商品哦！',
        icon: 'none',
        image: '',
        duration: 1000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return false;
    } else {
      utils.setStorageSync("paycar", arr);
    }
    // console.log(c)
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
  edit: function() {
    var that = this;
    console.log(123213213213)
    console.log(that.data.carts)
    // carts = that.data.carts
    if (that.data.status == "编辑") {

      // that.data.carts.forEach(function (v, i) {
      //   v.isTouchMove = false
      //   //滑动超过30度角 return 
      //   v.isTouchMove = true
      // })


      that.setData({
        nowdel: false,
        carts: that.data.carts,
        status: "完成",
        show: false
      })
    } else {

      that.data.carts.forEach(function(v, i) {
        v.isTouchMove = false
        //滑动超过30度角 return 
        v.isTouchMove = false
      })
      //更新数据


      that.setData({
        nowdel: true,
        carts: that.data.carts,
        status: "编辑",
        show: true,

      })

    }
  },
  onShow:function() {
    var that = this;
    //调用方法传相应参数

    this.setData({
      showSkeleton: true,
      hasList: false,
      word: false
      // carts: [
      //   { id: 1, title: '新鲜芹菜 半斤', image: '/images/cart/s5.png', count: 4, price: 0.01, selected: true, isTouchMove: false },
      //   { id: 2, title: '素米 500g', image: '/images/cart/s6.png', count: 1, price: 0.03, selected: true, isTouchMove: false }
      // ]
    });
    that.loadingDatatop(false);
    that.getTotalPrice();
  },
  loadingDatatop: function(isShowLoading) {
    var that = this;
    // if (app.globalData.isLogin) {
    that.requestDataList(isShowLoading);


    // } else {
    //   app.updateUserInfoCallback = res => {
    //     that.requestDataList(isShowLoading);


    //   }

    // }

  },

  requestDataList: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/MallProduct/ShopCarList";
    var usertoken = utils.getStorageSync("userToken");
    // var token = app.globalData.initToken;
    var params = {
      usertoken: usertoken
    };

    if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function(res) {
      // console.log(21421421323)
      // console.log(res)
      var res = datas.shopcart
      var list = res.data.list;
      // var list = datas.cart.data.list;

      if (list == "") {
        that.setData({
          hasList: false,
          word: true,
          showSkeleton: false
        })
      } else {


        that.setData({
          hasList: true,
          word: false,
          carts: list,
          showSkeleton: false
        });

        that.selectAll2()

      }

      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
  },


  editcart: function(id, action) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/MallProduct/EditShopCar";
    var usertoken = utils.getStorageSync("userToken");
    // var token = app.globalData.initToken;
    var id = id;
    var cation = action;
    var params = {
      usertoken: usertoken,
      pid: id,
      action: action,
      count: 1
    };

    // console.log(that.data.carts)


    utils.netRequest(apiUrl, params, function(res) {

      utils.wxHideLoading();
    }, null, 'POST');
  },


  //————————————————————————————————————————————————————————————————————————————————————————————————————以下是实现动画的方法
  /**
   * 当前商品选中事件
   */
  selectList(e) {

    var all = 0;
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    // console.log(index)
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected == true) {
        all++;
      }
      // carts[i].selected = selectAllStatus;
    }

    if (all == carts.length) {
      this.setData({
        selectAllStatus: true
      });
    } else {
      this.setData({
        selectAllStatus: false
      });
    }
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    // console.log(selectAllStatus)
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },
  selectAll2(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = true;
    let carts = this.data.carts;
    // console.log(selectAllStatus)
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },
  /**
   * 删除购物车当前商品
   */
  deleteall: function() {
    let carts = this.data.carts;
    // console.log(carts)






    for (var a = 0; a < carts.length; a++) {
      if (carts[a].selected == true) {
        this.editcart(carts[a].pid, 3);

      }
    }
    this.setData({
      carts: carts,
      // hasList: false
    })
    this.requestDataList(false);
  },

  deleteList: function(e) {
    // console.log(1343243)
    const index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    let carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {

      this.setData({
        hasList: false,
        word: true
      });
    } else {
      this.getTotalPrice();
    }
    this.editcart(id, 3);
  },

  /**
   * 购物车全选事件
   */


  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    let carts = this.data.carts;
    let count = carts[index].count;
    count = count + 1;
    carts[index].count = count;




    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    this.editcart(id, 1);
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let count = carts[index].count;
    if (count <= 1) {
      return false;
    }
    count = count - 1;
    carts[index].count = count;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
    this.editcart(id, 2);
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].count * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },



  onLoad: function() {

    var that = this;
    // console.log(app.globalData.isIPX)
    if (app.globalData.isIPX == 1) {
      // console.log(213213213213)
      that.setData({
        isIPX: true
      })
    }
  },
  //手指触摸动作开始 记录起点X坐标 
  touchstart: function(e) {
    var that = this;
    //开始触摸时 重置所有删除 
    this.data.carts.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的 
        v.isTouchMove = false;
    })
    if (that.data.status == "编辑") {
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        carts: this.data.carts
      })
    }
  },
  //滑动事件处理 
  touchmove: function(e) {
    var that = this,


      index = e.currentTarget.dataset.index, //当前索引 
      startX = that.data.startX, //开始X坐标 
      startY = that.data.startY, //开始Y坐标 
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标 
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标 
      //获取滑动角度 
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.carts.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return 
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑 
          v.isTouchMove = false
        else //左滑 
          v.isTouchMove = true
      }
    })
    //更新数据
    if (that.data.status == "编辑") {

      that.setData({
        carts: that.data.carts
      })
    }

  },
  /** 
   * 计算滑动角度 
   * @param {Object} start 起点坐标 
   * @param {Object} end 终点坐标 
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值 
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件 
  // del: function (e) {

  //   this.data.carts.splice(e.currentTarget.dataset.index, 1)
  //   this.setData({
  //     carts: this.data.carts
  //   })
  // }
})