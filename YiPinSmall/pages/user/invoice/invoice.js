// pages/address/address.js
const app = getApp();
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    addressList: null,
    selectedlist: [],
    startX: 0, //开始坐标
    startY: 0,
    items: [],
    list:[],
    isIPX:false,
    status:0,
    showSkeleton: true,
    rpxR:1,
    winHeight:null
  },


  dontinvoice:function(){
    wx.removeStorageSync("invoiceid")
    wx.navigateBack({
      delta:1
    })
  },

  del: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/DeleteInvoice";
    var usertoken = utils.getStorageSync("userToken");
    var token = app.globalData.initToken;
    var params = { usertoken: usertoken, id: id };
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function (res) {

      var invoiceid = utils.getStorageSync("invoiceid");
      console.log(invoiceid)
      if (invoiceid != null && invoiceid == id) {
        wx.removeStorageSync("invoiceid")
      }
      //手动关闭加载提示
      utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
      that.loaddata()
    }, null, 'GET');

  },



  //改变选中按钮状态
  changebtn: function (e) {
    var that = this;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    utils.setStorageSync("invoiceid", id);
    var selectedlist = that.data.selectedlist;
    //循环先设置全部为false
    for (let i in selectedlist) {
      selectedlist[i] = false;
    }
    // console.log("selectedlist", selectedlist);
    var selected = selectedlist[id];
    selectedlist[id] = !selected;
    that.setData({
      selectedlist: selectedlist
    })

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 100);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
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
   if (options.status==1){
     that.setData({
       status:1
     })
   }
    console.log(app.globalData.isIPX)
    if (app.globalData.isIPX == 1) {
      console.log(213213213213)
      that.setData({
        isIPX: true
      })
    }
    for (var i = 0; i < 30; i++) {
      this.data.items.push({
        isTouchMove: false //默认全隐藏删除
      })
    }
    this.setData({
      items: this.data.items
    })

    // that.loaddingData(true);
  },

  onShow: function () {
    var that = this;
    that.loaddata();
    that.loaddingData(false);
  },

  loaddata: function () {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/GetInvoice";
    var usertoken = utils.getStorageSync("userToken");
    var token = app.globalData.initToken;
    var params = { usertoken: usertoken };
    //手动显示加载框
    // utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function (res) {


      var res = datas.invoice
      var list = res.data;
      that.setData({
        showSkeleton: false,
        list: list
      });
      //手动关闭加载提示
      utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
  },


  loaddingData: function (isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
   
    } else {
      app.updateUserInfoCallback = res => {
      
      }
    }
  },
  
  /**
   * 编辑
   */
  editAdress: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/user/invoicedetail/invoicedetail?id=' + id,
    })


  },
  //选中返回上一页
  toback: function (e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    // var selected = e.currentTarget.dataset.selected;
    // if (selected) {
    utils.setStorageSync("invoiceid", id);
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 100);
    // }
  },

  //删除地址事件
  todelete: function (e) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/DeleteReceipt";
    var id = e.currentTarget.dataset.id;
    var usertoken = utils.getStorageSync("userToken");
    
    var params = {
      usertoken: usertoken,
      id: id
    };
    utils.netRequest(apiUrl, params, function (res) {
      that.loaddingData(true);
    }, null, "GET");
  },


  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
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
    that.data.items.forEach(function (v, i) {
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
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  // //删除事件
  // del: function (e) {
  //   this.data.items.splice(e.currentTarget.dataset.index, 1)
  //   this.setData({
  //     items: this.data.items
  //   })
  // }
})