// pages/orderdetail/orderdetail.js
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const app = getApp();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    detail: [],
    orderid: null,
    status: "",
    statusname: '',
    isIPX: false,
    showSkeleton: true,
    rpxR: 1,
    winHeight: null,
    isaccount: 0
  },
  changestatus: function () {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/ConfirmOrder";
    var usertoken = utils.getStorageSync("userToken");
    // var token = app.globalData.initToken;
    var orderid = that.data.orderid
    var params = { userToken: usertoken, orderId: orderid };
    //手动显示加载框


    wx.showModal({
      title: '',
      content: '是否确认收货',
      showCancel: true,
      cancelText: '否',
      cancelColor: '#000',
      confirmText: '是',
      confirmColor: '#000',
      success: function (res) {

        if (res.confirm) {
          utils.wxShowLoading("请稍候...", true);
          utils.netRequest(apiUrl, params, function (res) {
            utils.wxHideLoading();
            //手动停止刷新
            wx.stopPullDownRefresh();
            wx.showToast({
              title: '签收成功',
            })

            that.requestDataList(false);
            // var page = getCurrentPages().pop();
            // if (page == undefined || page == null) return;

            // page.onLoad(); 


          }, null, 'POST');
        }


      },
      fail: function (res) { },
      complete: function (res) { },
    })




  },
  tocard: function (e) {
    // console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: "/pages/order/comment/comment?id=" + id + "&orderid=" + orderid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  togoodsdetail: function (e) {
    var id = e.currentTarget.dataset.id
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/goods/show/show?id=" + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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
    // console.log(app.globalData.isIPX)
    if (app.globalData.isIPX == 1) {
      // console.log(213213213213)
      that.setData({
        isIPX: true
      })
    }

    console.log("刚刚传过来的东西", options)
    this.setData({
      orderid: options.id,
      status: options.status,
      isaccount: options.isaccount
    })


  },


  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.detail.deliverynum,
      success: function (res) {
        // self.setData({copyTip:true}),
        // wx.showModal({
        //   title: '提示',
        //   content: '复制成功',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('确定')
        //     } else if (res.cancel) {
        //       console.log('取消')
        //     }
        //   }
        // })
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;



    that.loadingDatatop(true);

  },

  loadingDatatop: function (isShowLoading) {
    var that = this;
    that.requestDataList(isShowLoading);
  },
  requestDataList: function (isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/User/newGetWxOrdrlDetails";
    var usertoken = utils.getStorageSync("userToken");
    // var token = app.globalData.initToken;
    var orderid = that.data.orderid
    console.log("订单的id", orderid)
    var params = { usertoken: usertoken, orderid: orderid };
    //手动显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function (res) {



      if (that.data.status == 4) {
        var res = datas.orderdetail1
      } else if (that.data.status == 5) {
        var res = datas.orderdetail2
      }
      else if (that.data.status == 10) {
        var res = datas.orderdetail3
      }




      // var data = datas.orderdetail.data
      var list = res.data;

      // if (that.data.status==4){
      //   that.setData({
      //     statusname:"待发货"
      //   });
      // } else if (that.data.status == 5){
      //   that.setData({
      //     statusname: "待收货"
      //   });
      // }
      // else if (that.data.status == 10) {
      //   that.setData({
      //     statusname: "已完成"
      //   });
      // }

      // console.log(777777777777777777777)
      // console.log(list.item)
      //cos/sin * x   xcosx/sinx
      that.setData({
        detail: list,
        list: list.productlist,

      });
      setTimeout(function () {
        that.setData({
          showSkeleton: false
        })
      }, 200)
      // if (list.item==undefined){
      //   that.setData({
      //     detail: list.list[0],
      //     list: list.list[0]
      //   });
      // }else{
      //   that.setData({
      //     detail: list.list[0],
      //     list: list
      //   });
      // }


      // console.log(list)
      //手动关闭加载提示

      setTimeout(function () {

        // if (isShowLoading) utils.wxHideLoading();

      }, 300)
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    if (that.data.isaccount == 1) {
      wx.navigateTo({
        url: '/pages/order/list/list',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})