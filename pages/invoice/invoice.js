// pages/invoice/invoice.js
const utils = require("../../utils/util.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoicehidden: true,
    invoicestatus: 0,//一是个人二是公司零是没设
    invoicearr: [],
    list:[],
    edit: 0,//0是添加1是修改
    id:1,//当前修改的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  choose:function(e){
    var id = e.currentTarget.dataset.id
     utils.setStorageSync("invoiceid",id);
     var invoiceid = utils.getStorageSync("invoiceid");
     console.log(id)
     console.log(invoiceid)
     wx.navigateBack({
       delta: 1,
     })
  },
  del:function(e){
    var id = e.currentTarget.dataset.id
      var that = this;
      var apiUrl = app.globalData.webUrl + "/user/DeleteInvoice";
      var usertoken = utils.getStorageSync("userToken");
      var token = app.globalData.initToken;
      var params = { usertoken: usertoken, id: id };
      //手动显示加载框
utils.wxShowLoading("请稍候...", true);
      utils.netRequest(apiUrl, params, function (res) {


        //手动关闭加载提示
   utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();
        that.loaddata()
      }, null, 'GET');

  },
  cancel: function () {
    this.setData({
      invoicehidden: true,
    })
  },
  
  invoiceformsubmit: function (e) {

    var that = this;
    var type1 = e.detail.target.dataset.type
    console.log(type1)


    console.log(e.detail.value)
    var usertoken = utils.getStorageSync("userToken");



    if (type1==0){
    if (that.data.invoicestatus == 1) {
      var obj = new Object({
        "id":0,
        "type":1,
        "mobile": e.detail.value.inphone,
        "email": e.detail.value.inemail,
        "usertoken": usertoken,
        "title": e.detail.value.inname,
        // "incontent": e.detail.value.incontent,
        // "inname": e.detail.value.inname,
      });

      that.setData({
        invoicearr: obj
      })

      if (e.detail.value.inphone && e.detail.value.title != '') {
        this.setData({
          invoicehidden: true,
        })
        wx.showToast({
          title: '发票合理',

        })
      } else {
        wx.showToast({
          title: '请全部填选',
          icon: "none"
        })
      }
    }
    if (that.data.invoicestatus == 2) {
      var obj = new Object({
        "id": 0,
        "type": 2,
        "mobile": e.detail.value.inphone,
        "email": e.detail.value.inemail,
        "usertoken": usertoken,
        "title": e.detail.value.inname,
        "code": e.detail.value.innum
        // "incontent": e.detail.value.incontent,
        // "inname": e.detail.value.inname,
      });

      that.setData({
        invoicearr: obj
      })

      if (e.detail.value.inphone && e.detail.value.title != '') {
        this.setData({
          invoicehidden: true,
        })
        wx.showToast({
          title: '发票合理',

        })
      } else {
        wx.showToast({
          title: '请全部填选',
          icon: "none"
        })
      }
    }
    console.log(that.data.invoicearr)



    var apiUrl = app.globalData.webUrl + "/user/EditInvoice";
    var token = app.globalData.initToken;

    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, that.data.invoicearr, function (res) {


      //手动关闭加载提示
      utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    }, null, 'POST');
    }



    if (type1 == 1) {
      if (that.data.invoicestatus == 1) {
        var obj = new Object({
          "id": that.data.id,
          "type": 1,
          "mobile": e.detail.value.inphone,
          "email": e.detail.value.inemail,
          "usertoken": usertoken,
          "title": e.detail.value.inname,
          // "incontent": e.detail.value.incontent,
          // "inname": e.detail.value.inname,
        });

        that.setData({
          invoicearr: obj
        })

        if (e.detail.value.inphone && e.detail.value.title != '') {
          this.setData({
            invoicehidden: true,
          })
          wx.showToast({
            title: '发票合理',

          })
        } else {
          wx.showToast({
            title: '请全部填选',
            icon: "none"
          })
        }
      }
      if (that.data.invoicestatus == 2) {
        var obj = new Object({
          "id": that.data.id,
          "type": 2,
          "mobile": e.detail.value.inphone,
          "email": e.detail.value.inemail,
          "usertoken": usertoken,
          "title": e.detail.value.inname,
          "code": e.detail.value.innum
          // "incontent": e.detail.value.incontent,
          // "inname": e.detail.value.inname,
        });

        that.setData({
          invoicearr: obj
        })

        if (e.detail.value.inphone && e.detail.value.title != '') {
          this.setData({
            invoicehidden: true,
          })
          wx.showToast({
            title: '发票合理',

          })
        } else {
          wx.showToast({
            title: '请全部填选',
            icon: "none"
          })
        }
      }
      console.log(that.data.invoicearr)



      var apiUrl = app.globalData.webUrl + "/user/EditInvoice";
      var token = app.globalData.initToken;

      //手动显示加载框
      utils.wxShowLoading("请稍候...", true);
      utils.netRequest(apiUrl, that.data.invoicearr, function (res) {


        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();
      }, null, 'POST');
    }


    // if (that.data.invoicestatus == 0) {
    //   wx.showToast({
    //     title: '请选择发票类型',
    //     icon: "none"
    //   })
    // }

    that.loaddata()
  },

  people: function () {
    this.setData({
      invoicestatus: 1
    })
  },
  company: function () {
    this.setData({
      invoicestatus: 2
    })
  },
  invoicee: function (e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/GetInvoice";
    var usertoken = utils.getStorageSync("userToken");
    var token = app.globalData.initToken;
    var params = { usertoken: usertoken,id:id };
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function (res) {

      console.log(213213213213)
      var list = res.data;


      var obj = new Object({
        "mobile": list[0].mobile,
        "email": list[0].email,
        "title": list[0].title,
        "code": list[0].code
      });


      that.setData({
        id:id,
        edit:1,
        invoicestatus: list[0].type,
        invoicearr: obj,
      });
      //手动关闭加载提示
      utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    }, null, 'GET');




    that.setData({
      invoicehidden: false
    })
  },

  invoice: function (e) {

    var that = this;

    that.setData({
      invoicehidden: false,
      edit:0
    })
  },

  onLoad: function (options) {
  
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

that.loaddata()
      

  },
  loaddata:function(){
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/GetInvoice";
    var usertoken = utils.getStorageSync("userToken");
    var token = app.globalData.initToken;
    var params = { usertoken: usertoken };
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function (res) {

      console.log(213213213213)
      var list = res.data;
      that.setData({

        list: list
      });
      //手动关闭加载提示
      utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    }, null, 'GET');
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})