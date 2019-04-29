
const app = getApp();
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    hidden: true, //是否显示底部地区选择器
    address: "",
    phone: "",
    name: "",
    detail: "",
    code: "",
    name: "",
    mobile: "",
    code: "",
    isDefault: false,
    invoicearr:[]

  },
//3/2 x^2 +cosx


//c6r x^1/2(6-r)-x-r/2
check:function(e){
  // console.log(e)
  var invoicearr = this.data.invoicearr

   invoicearr.type=e.currentTarget.dataset.id
   console.log(invoicearr)
    this.setData({
      invoicearr: invoicearr
    })
},

  invoiceformsubmit: function (e) {


    var usertoken = utils.getStorageSync("userToken");
    var that = this;




    var obj = new Object({
      "id":that.data.id,
      "type": e.detail.value.type,
      "mobile": e.detail.value.mobile,
      "email": e.detail.value.email,
      "usertoken": usertoken,
      "title": e.detail.value.title,
      "code": e.detail.value.code
      // "incontent": e.detail.value.incontent,
      // "inname": e.detail.value.inname,
    });
    var validatemobile = utils.validatemobile(obj.mobile);
    var validateemail = utils.validateEmail(obj.email);
  //  console.log(213213213213)
  //  console.log(validatemobile)
  //  console.log(validateemail)
   if (obj.mobile == "" || obj.email == "" || obj.title == "" ){
      wx.showToast({
        title: '发票信息不能有空',
        icon:"none"
      })
   } else if (!validatemobile){

     wx.showToast({
       title: '手机格式不正确',
       icon: "none"
     })
   } else if (!validateemail){
     wx.showToast({
       title: '邮箱格式不正确',
       icon: "none"
     })
    }else{
      var apiUrl = app.globalData.webUrl + "/user/EditInvoice";
      var token = app.globalData.initToken;
      //手动显示加载框
      utils.wxShowLoading("请稍候...", true);
      utils.netRequest(apiUrl, obj, function (res) {
        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();
      }, null, 'POST');

      wx.navigateBack({
        delta: 1,
      })
    }




  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("====", options);
    var id = options.id;
    that.setData({
      id: id
    })
    that.loaddingData(true);
  },

  changebtn: function (e) {
    var that = this;
    var isDefault = that.data.isDefault;
    that.setData({
      isDefault: !isDefault
    })
  },

  loaddingData: function (isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.todetail(that.data.id);
    } else {
      app.updateUserInfoCallback = res => {
        that.todetail(that.data.id);
      }
    }
  },

  onShow: function () {
    var that = this;

  },

  todetail: function (id) {
    var that = this;

   
      // console.log(e.currentTarget.dataset.id)
      var id = that.data.id
      var that = this;
      var apiUrl = app.globalData.webUrl + "/user/GetInvoice";
      var usertoken = utils.getStorageSync("userToken");
      var token = app.globalData.initToken;
      var params = { usertoken: usertoken, id: id };
      //手动显示加载框
      utils.wxShowLoading("请稍候...", true);
      // utils.netRequest(apiUrl, params, function (res) {

        // console.log(213213213213)
        var res = datas.invoicedetail
        var list = res.data;

        if (id==0){
          var obj = new Object({
            "mobile": "",
            "email": "",
            "title": "",
            "code": "",
            "type": "1",
          });
        }else{

          var obj = new Object({
            "mobile": list[0].mobile,
            "email": list[0].email,
            "title": list[0].title,
            "code": list[0].code,
            "type": list[0].type,
          });
        }




        that.setData({
          id: id,
          invoicearr: obj,
        });
        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();
      // }, null, 'GET');




      that.setData({
        invoicehidden: false
      })



  },

  // getSelecedData() {
  //   console.table(getSelectedAreaData());
  // },

  //
  // showpicker: function(e) {
  //   var that = this;
  //   that.setData({
  //     hidden: false,
  //   })
  // },
  // confirm: function() {
  //   var that = this;
  //   that.setData({
  //     hidden: true,
  //   })
  // },
  //获取电话号码
  getphone: function (e) {
    // console.log(e);
    this.data.mobile = e.detail.value;
  },
  getcode: function (e) {
    // console.log(e);
    this.data.code = e.detail.value;
  },

  getname: function (e) {
    // console.log(e);
    this.data.name = e.detail.value;
  },
  getaddress: function (e) {
    var that = this;
    console.log(e);
    var address = e.detail.value;
    //转换地址的格式text = text.replace(/\s/ig,'');
    that.data.address = address.replace(/\s/ig, '');
    console.log(that.data.address);
  },
  getDetail: function (e) {
    var that = this;
    console.log(e);
    that.data.detail = e.detail.value;
  },

  // toPpreserve: function (isShowLoading) {
  //   var that = this;
  //   var apiUrl = app.globalData.webUrl + "/user/EditReceipt";
  //   var usertoken = utils.getStorageSync("userToken");
  //   var id = that.data.id;
  //   var code = that.data.code;
  //   var mobile = that.data.mobile;
  //   var name = that.data.name;
  //   var address = that.data.region.toString() + "," + that.data.detail;
  //   var isDefault = that.data.isDefault;
  //   var params = {
  //     usertoken: usertoken,
  //     rId: id,
  //     code: code,
  //     mobile: mobile,
  //     name: name,
  //     address: address,
  //     isDefault: isDefault
  //   };
  //   //手动显示加载框
  //   // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
  //   if (mobile != null && name != null && address != null) {
  //     utils.netRequest(apiUrl, params, function (res) {
  //       console.log(res)
  //       wx.navigateBack({
  //         delta: 1
  //       })
  //       // wx.navigateTo({
  //       //   url: '/pages/user/address/address/address',
  //       // })

  //       //手动关闭加载提示
  //       if (isShowLoading) utils.wxHideLoading();
  //       //手动停止刷新
  //       wx.stopPullDownRefresh();
  //     }, null, 'GET');
  //   }
  // },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  }
})