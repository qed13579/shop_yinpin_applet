// pages/account/account.js
const utils = require("../../utils/util.js");
const datas = require("../../utils/data.js");
var app = getApp()
Page({
  // arr[0].push(carts[a].pid)//商品id
  //       arr[1].push(carts[a].count)//商品数量
  //       arr[2].push(carts[a].price)//商品单价
  //       arr[3].push(carts[a].postage)//邮费
  //       arr[4].push(carts[a].title)//商品名称
  //       arr[5].push(carts[a].img)//商品名称
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    detail: [],
    arr: [],
    postage: '',
    allprice: '',
    total: '',
    address: "",
    name: "",
    mobile: "",
    addressid: null,
    def: 0, //没有缓存为0有为1
    invoice: [],
    isIPX: false,
    invoicehidden: true,
    status: 1,
    pageNo: 1,
    hasMore: true,
    hasRefesh: false,
    hidden: true,
    isHasData: true, //默认有数据
    carts: [],
    totaldiscount: 0,
    sheet: 0,
    addresshidden: true,
    animationData: {},
    animationData2: {},
    rpxR: 0,
    hidden1: true,
    nowinput: "",
    cartsbackups: [],
    cardarr: [],
    nowcarts: [],
    hidemodal: false,
    btndisable:false,
    orderid:0,
    winHeight: 0
   
  },


  getTotalPrice() {
    var that = this
    let carts = this.data.carts; // 获取购物车列表
    var total = 0;
    var sheet = 0;
    // for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
    //   if (carts[i].selected) { // 判断选中才会计算价格
    //     total += carts[i].price; // 所有价格加起来
    //     sheet++;
    //   }
    // }

    for (var a = 0; a < carts.length; a++) { //循环礼品卡
      if (carts[a].selected == true) {
        sheet++;

        var pid = carts[a].pid //拿出选中礼品卡的pid数组
        var price = carts[a].balance //拿出选中礼品卡剩余价格
        if (pid == "") { //当优惠券pid数组为空时为通用券
          // if (that.data.total - that.data.postage >= price){//当商品总价大于通用券余额时设优惠（通用券的余额）
          //   total = price //打折的总价为礼品卡余额
          //   // console.log(total)
          // } else {//当商品总价小于通用券余额时设优惠（商品的余额）
          //   total = that.data.total - that.data.postage  //打折的总价为商品总价
          // }


        } else { //当优惠券pid数组有值时对比pid与商品的id契合
          var arrr = that.getArrEqual(pid, that.data.arr[0]) //拿出契合的值
          // var arrr = that.getArrEqual([1, 3], [1, 3])//拿出契合的值
          console.log("契合值：" + arrr) //契合值[1, 3]
          var aarr = that.data.arr[0]
          var aarr1 = that.data.arr[1] //单价
          var aarr2 = that.data.arr[2] //数量
          var cc = [];
          var dd = 0; //可优惠价格
          for (var aa = 0; aa < arrr.length; aa++) {
            // console.log("契合值"+arrr[0])
            for (var b = 0; b < aarr.length; b++) {

              if (arrr[aa] == aarr[b]) {
                // console.log("契合值" + b)
                cc.push(b)

              }
            }
          }
          console.log("相同pid时的坐标：" + cc)
          for (var d = 0; d < cc.length; d++) {
            dd = dd + aarr1[cc[d]] * aarr2[cc[d]] //可优惠价格
            console.log("可优惠商品数量：" + aarr1[cc[d]])
            console.log("可优惠商品单价：" + aarr2[cc[d]])
            console.log("可优惠商品价格：" + dd / 100)
          }


          if (dd >= price) { //当可用礼品卡商品总价大于通用券余额时设优惠（通用券的余额）
            total = price //打折的总价为礼品卡余额

          } else { //当可用礼品卡商品总价小于通用券余额时设优惠（商品的余额）
            total = dd //打折的总价为商品总价
          }

        }

        that.setData({
          nowcarts: carts[a],
        })



      }
    }
    console.log("当前点击的礼品卡信息：", that.data.nowcarts)

    total = that.data.postage + total
    this.setData({ // 最后赋值到data中渲染到页面
      // carts: carts,
      totaldiscount: total.toFixed(2),
      sheet: sheet,
      // total: (that.data.total - total).toFixed(2)
    });
    console.log("总打折价格：" + that.data.totaldiscount)

  },

  getArrEqual(arr1, arr2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
      for (let j = 0; j < arr1.length; j++) {
        if (arr1[j] === arr2[i]) {
          newArr.push(arr1[j]);
        }
      }
    }
    return newArr;
  },

  requestcartsList: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/getgiftCardlist";
    var usertoken = utils.getStorageSync("userToken");

    var pid = that.data.arr[0].join(",");
    console.log("当前的商品id：" + pid)
    var params = {
      userToken: usertoken,
      pidList: pid
    };

    if (isShowLoading) utils.wxShowLoading("请稍候...", true);

    // that.setData({

    //   totaldiscount: 0,
    //   sheet: 0,
    // })

    // utils.netRequest(apiUrl, params, function(res) {
      console.log("全部卡的信息：", res)
      // var data = datas.discount.data.list;
      // var res = datas.discount;
      var res = datas.giftcardincart
      
      var data = res.data;
      var list = [];
      var list1 = [];
      var list2 = [];
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];

          var obj = new Object({
            "balance": item.balance,
            "id": item.id,
            "title": item.title,
            "img": item.img,
            "price": item.price,
            "time": item.expiredtime,
            "pid": item.pid,
            "number": item.number,
          });



          if (item.pid == "") { //当礼品券pid为空时礼品券为可用
            // list1.push(obj);
            list2.push(obj);
          } else {
            list1.push(obj);

            // var arrr = that.getArrEqual(item.pid, that.data.arr[0])
            // if (arrr != "") {//当礼品券pid为与商品匹配时时礼品券为可用
            //   list1.push(obj);
            // }else{
            //   list2.push(obj);
            // }
          }



          list.push(obj);




          // console.log("找相同元素"+arrr)
        }


      }

      console.log("全部卡的信息：", list)
      // //如果 list 长度为 0，或翻到最后一页,则设置没有更多数据
      // if (list.length == 0 || that.data.pageNo == res.data.totalpage) {
      //   that.setData({
      //     hasMore: false,
      //   })
      // }
      that.setData({
        carts: list1,
        carts2: list2,
      });


      // if (res.data.page == 1) {
      //   that.setData({
      //     carts: list,
      //   });
      //   if (list.length == 0) {
      //     that.setData({
      //       isHasData: false //隐藏无数据提示的图片
      //     })
      //   } else {
      //     that.setData({
      //       isHasData: true //隐藏无数据提示的图片
      //     })
      //   }
      // }
      // else {
      //   that.setData({
      //     carts: that.data.carts.concat(list),
      //   });
      // }

      if (list.length == 0) {
        that.setData({
          hidden: false //隐藏无数据提示的图片
        })
      }




      //隐藏加载框
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
    //  utils.wxHideLoading();




  },
  cancel2: function() {
    this.setData({
      hidden1: true,

    })
  },
  tips: function() {
    this.setData({
      hidden1: false
    })
    // console.log(1)
  },

  cardformsubmit: function(e) {
    console.log("正在绑定礼品卡的号码：" + e.detail.value.number)
    console.log("正在绑定礼品卡的密码：" + e.detail.value.pswd)

    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/bindcard";
    var usertoken = utils.getStorageSync("userToken");
    var number = e.detail.value.number;
    var password = e.detail.value.pswd;
    var params = {
      userToken: usertoken,
      number: number,
      password: password
    };



    if (number != "" && password!=""){
      //手动显示加载框
      utils.wxShowLoading("请稍候...", true);
      utils.netRequest(apiUrl, params, function (res) {
        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();

        that.setData({
          hidden: true,

        })
        wx.showToast({
          title: '绑定成功',
        })
        
     
          that.cancelall()
   
        that.requestcartsList(false)
      }, function (res) {
        wx.showToast({
          title: res.error,
          icon: 'none'
        })
        // setTimeout(function () {
        //   that.cancel()
        // }, 1000)
      }, 'GET');
    }else{

      wx.showToast({
        title: '绑定信息不能为空',
        icon: 'none'
      })
      // wx.showToast({
      //   title: '绑定信息不能为空',
      //   icon: 'none',
      //   image: '',
      //   duration: 0,
      //   mask: true,
      //   success: function(res) {},
      //   fail: function(res) {},
      //   complete: function(res) {},
      // })
    }


 


  },
  onShow: function() {
    var that = this;
    that.setData({
      cardarr: [],
      totaldiscount: 0,
      sheet: 0,
      // addresshidden: true,
      // address: "",
      // name: "",
      // mobile: "",
    })

    that.loadingDatatop(false);
  },


  translateY: function() {
    // 先旋转后放大
    // this.animation.translateY(0).step()

    this.setData({
      invoicehidden: false
    })
    if (this.data.isIPX == false) {
      this.animation.translateY(-1000 / this.data.rpxR).step({
        duration: 200
      })
    } else {
      this.animation.translateY(-1100 / this.data.rpxR).step({
        duration: 200
      })
    }


    this.setData({
      animationData: this.animation.export()
    })
  },

  translateY2: function() {
    // 先旋转后放大
    // this.animation.translateY(0).step()

    this.setData({
      invoicehidden: false
    })
    if (this.data.isIPX == false) {
      this.animation.translateY(-1000 / this.data.rpxR).step({
        duration: 200
      })
    } else {
      this.animation.translateY(-1100 / this.data.rpxR).step({
        duration: 200
      })
    }


    this.setData({
      animationData2: this.animation.export()
    })
  },


  cancel: function() {

    var that = this;

    that.animation.translateY(0).step({
      duration: 200
    })
    // this.animation.translateY(500).step()
    that.setData({
      animationData2: this.animation.export(),
      nowinput: "",
      
    })


  },
  cancelall: function () {
  var that=this;

  that.animation.translateY(0).step({
      duration: 200
    })
    // this.animation.translateY(500).step()
  that.setData({
      // invoicehidden: true,
      animationData2: this.animation.export(),
      nowinput: "",
    })


  },

  confirm: function() {
    var that = this
    this.setData({
      invoicehidden: true,
    })
    var arr = [];
    // arr = new Array();

    var carts = this.data.carts
    var cartData = {}
    var c = 0
    for (var a = 0; a < carts.length; a++) {
      if (carts[a].selected == true) {
        arr.push(carts[a].id) //礼品卡id
        that.setData({
          nowcarts: carts[a]
        })
      }

    }

    this.animation.translateY(0).step({
      duration: 200
    })
    // this.animation.translateY(500).step()
    this.setData({
      animationData: this.animation.export()
    })


    console.log("当前选中礼品卡的数组：" + arr)


    that.setData({
      cardarr: arr
    })



    // if (item.pid == "") {

    // } else {
    //   var arrr = that.getArrEqual(item.pid, that.data.arr[0])
    // }


  },


  selectList(e) {

    var all = 0;
    const index = e.currentTarget.dataset.index;
    var carts = this.data.carts;

    if (carts[index].selected == true) {
      const selected = carts[index].selected; //undefind
      console.log("礼品卡选中状态：" + !selected) //true
      carts[index].selected = !selected;
    } else {
      for (var a = 0; a < carts.length; a++) { //设置为单选
        carts[a].selected = false
        //  console.log(carts)//true
      }
      const selected = carts[index].selected; //undefind
      console.log("礼品卡选中状态：" + !selected) //true
      carts[index].selected = !selected;
    }



    this.setData({
      carts: carts,
      cartsbackups: carts,
    });
    this.getTotalPrice();
  },


  swichNav: function(e) {
    var status = e.target.dataset.status;
    this.setData({

      status: status,
      // hasMore: false,
      // pageNo: 1,
      // isHasData: false,
      hidden: true,
    })

    // console.log(status)
    // this.requestcartsList(true)
  },



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
  //     that.requestcartsList(false);
  //   }

  // },





  people: function() {
    this.setData({
      invoicestatus: 1
    })
  },
  company: function() {
    this.setData({
      invoicestatus: 2
    })
  },
  gift: function() {
    // var that = this;

    // that.setData({
    //   invoicehidden: false
    // })
  },
  invoice: function() {
    wx.navigateTo({
      url: '/pages/user/invoice/invoice',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toaddress: function() {
    wx.navigateTo({
      url: '/pages/user/address/address/address?isaccount=1',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  requestDataList: function(isShowLoading) {
    var that = this;
    var arr = utils.getStorageSync("paycar");
    var address = utils.getStorageSync("addressId");

    console.log("当前地址id：" + address)
    that.setData({
      addressid: null
    })
    if (address == '') {
      // console.log(2321321321321)
      that.setData({

        def: 0
      })
      that.address(null)
    } else {
      that.setData({
        def: 1
      })
      that.address(address)
    }
    console.log("当前购物车商品信息：" + arr)

    var c = 0
    var postage = Math.max(...arr[3])
    for (var a = 0; a < arr[2].length; a++) {
      c += arr[2][a] * arr[1][a]
    }
    var allprice = c
    var total = allprice + postage
    console.log("计算好的运费：" + postage)
    console.log("商品总额：" + allprice)
    console.log("没用礼品卡的实付款：" + total)
    that.setData({
      arr: arr,
      postage: postage,
      allprice: allprice,
      total: total
    });




    //手动显示加载框
    if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // var data = datas.account.data
    // console.log("出错",data);

    // that.setData({
    //   detail: data.account,
    //   list: data
    // });
    if (isShowLoading) utils.wxHideLoading();
    wx.stopPullDownRefresh();
  },


  address: function(addressid) {
    var that = this
    var apiUrl = app.globalData.webUrl + "/user/GetReceipt"; //获取地址列表
    var usertoken = utils.getStorageSync("userToken");


    console.log("当前地址信息22：" + addressid)

    if (addressid == null) {
      var params = {
        userToken: usertoken
      };
    } else {

      var params = {
        userToken: usertoken,
        rId: addressid
      };



    }

    console.log("排错", params)


    // utils.netRequest(apiUrl, params, function(res) { //排错，假如传了一个错误的id再把params的地址的id设为null再去操作api

      var res = datas.addressincart
      console.log("排错", res)
      if (res.data == "") {
        params = {
          userToken: usertoken
        };

      } else {

      }


      // utils.netRequest(apiUrl, params, function(res) {


        var res = datas.addressincart
        console.log("排错", params)

        if (res.data == "") { //假如什么地址都没有
          console.log("当前地址为无或者给的id错了", res)

          if (that.data.hidemodal == false) {
            wx.showModal({
              title: '',
              content: '您还没收货地址，是否新建一个？',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#000',
              confirmText: '确定',
              confirmColor: '#000',
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    // url: '/pages/user/address/address/address?isaccount=1',
                    url: '/pages/user/address/add_address/add_address?id=0' + "&isaccount=0",
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                  })
                } else {

                }

              },
              fail: function(res) {},
              complete: function(res) {},
            })
          }




          that.setData({
            address: "",
            name: "",
            mobile: "",
            addresshidden: false
          })


        } else {
          var count = 0
          console.log("当前地址为有", res)
          if (that.data.def == 0) { //假如没有缓存地址
            for (var a = 0; a < res.data.length; a++) {
              if (res.data[a].isdefault == true) {

                that.setData({
                  address: res.data[a].address,
                  name: res.data[a].name,
                  mobile: res.data[a].mobile,
                  addressid: res.data[a].id,
                  addresshidden: false
                })
                utils.setStorageSync("addressId", res.data[a].id); //重新定义缓存地址id
                break;

              }
              count++;

              console.log(count)
              console.log(res.data.length)
              if (res.data.length == count) { //假如没有缓存地址,也没有默认地址

                that.setData({
                  address: res.data[0].address,
                  name: res.data[0].name,
                  mobile: res.data[0].mobile,
                  addressid: res.data[0].id,
                  addresshidden: false
                })
                utils.setStorageSync("addressId", res.data[0].id); //重新定义缓存地址id
              }
            }
          } else { //假如有缓存地址

            that.setData({
              address: res.data[0].address,
              name: res.data[0].name,
              mobile: res.data[0].mobile,
              addressid: res.data[0].id,
              addresshidden: false
            })
          }
          utils.setStorageSync("addressId", res.data[0].id); //重新定义缓存地址id


        }


        console.log("当前地址的id：" + that.data.addressid)
        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();
      // }, null, 'GET');


    // }, null, 'GET');
    console.log("当前地址为无", that.data.address)
  },

  formsubmit: function(e) {

    var that = this;
    that.setData({
      btndisable:true
    })
    // console.log(that.data.flag)
    var arr = that.data.arr
    console.log("当前备注的信息：" + e.detail.value.content)
    var content = e.detail.value.content;
    var pid = arr[0];
    console.log(pid)
    var invoiceid = utils.getStorageSync("invoiceid");



    var num = arr[1];
    var rId = that.data.addressid;
    var usertoken = utils.getStorageSync("userToken");
    var isShopCar = arr[6][0];

    console.log("当前提交地址的id：" + rId)

    // console.log("当前提交发票的id："+invoiceid)


    if (rId == null) {
      // utils.wxshowToast("没选地址请点击选择", "none", 1000);
      if (that.data.hidemodal == false) {

        wx.showModal({
          title: '',
          content: '您还没收货地址，是否新建一个？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000',
          confirmText: '确定',
          confirmColor: '#000',
          success: function(res) {


            if (res.confirm) {
              wx.navigateTo({
                // url: '/pages/user/address/address/address?isaccount=1',
                url: '/pages/user/address/add_address/add_address?id=0' + "&isaccount=0",
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            } else {

            }

          },
          fail: function(res) {},
          complete: function(res) {
            that.setData({
              btndisable: false
            })

          },
        })
      }
      
    } else {


      console.log("当前页面是否从购物车页面点进来的：" + isShopCar)
      var apiUrl = app.globalData.webUrl + "/tenpay/JsApi";
      if (that.data.invoice.type == 0) { //当发票没类型的时候提交无发票的数据

        if (that.data.cardarr != "") {

          var cardId = that.data.cardarr[0];
          var invoiceId = 0;
          var isInvoice = false;
          // var params = {
          //   cardId: that.data.cardarr[0],
          //   pid: pid,
          //   num: num,
          //   usertoken: usertoken,
          //   isShopCar: isShopCar,
          //   rId: rId,
          //   remark: content,
          //   invoiceId: 0,
          //   isInvoice: false
          // };
          console.log("使用的优惠券：" + cardId)
          console.log("发票id：" + invoiceId)
          console.log("是否用发票：" + isInvoice)
        } else {
          var cardId = 0;
          var invoiceId = 0;
          var isInvoice = false;

          // var params = {
          //   cardId: 0,
          //   pid: pid,
          //   num: num,
          //   usertoken: usertoken,
          //   isShopCar: isShopCar,
          //   rId: rId,
          //   remark: content,
          //   invoiceId: 0,
          //   isInvoice: false
          // };
          // console.log(invoiceid)
          console.log("使用的优惠券：" + cardId)
          console.log("发票id：" + invoiceId)
          console.log("是否用发票：" + isInvoice)
        }

      } else {
        if (that.data.cardarr != "") {

          var cardId = that.data.cardarr[0];
          var invoiceId = invoiceid;
          var isInvoice = true;
          // var params = {
          //   cardId: that.data.cardarr[0],
          //   pid: pid,
          //   num: num,
          //   usertoken: usertoken,
          //   isShopCar: isShopCar,
          //   rId: rId,
          //   remark: content,
          //   invoiceId: invoiceid,
          //   isInvoice: true
          // };
          console.log("使用的优惠券：" + cardId)
          console.log("发票id：" + invoiceId)
          console.log("是否用发票：" + isInvoice)
        } else {

          var cardId = 0;
          var invoiceId = invoiceid;
          var isInvoice = true;

          // var params = {
          //   cardId:0,
          //   pid: pid,
          //   num: num,
          //   usertoken: usertoken,
          //   isShopCar: isShopCar,
          //   rId: rId,
          //   remark: content,
          //   invoiceId: invoiceid,
          //   isInvoice: true
          // };
          console.log("使用的优惠券：" + cardId)
          console.log("发票id：" + invoiceId)
          console.log("是否用发票：" + isInvoice)

        }

      }

      var params = {
        cardId: cardId, //要变的量
        pid: pid,
        num: num,
        usertoken: usertoken,
        isShopCar: isShopCar,
        rId: rId,
        remark: content,
        invoiceId: invoiceId, //要变的量
        isInvoice: isInvoice //要变的量
      };


      /** 发起请求，获取支付配置的参数
       *  如果 res.data.payInfo 为空，表明礼品抵扣完订单总额，直接支付成功
       *  否则需要继续调起微信支付
       */
      var orderNum = ""; //当前支付订单号
      utils.netRequest(apiUrl, params, function(res) {
        console.log("点击提交返回来的东西：", res.data.orderid);
        //当用户取消订单的时候需要使用其作为参数提交请求，以回滚所抵扣的礼品卡操作
        orderNum = res.data.ordernum;

        that.setData({
          orderid:res.data.orderid
        })
       
        //如果 res.data.payInfo 为空，表明礼品抵扣完订单总额，直接支付成功


        //首先确保有返回
        if (res.data.payinfo) {
          //如果 res.data.payInfo 不为空，表明需要支付
          if (res.data.payinfo.timeStamp != ""){
            utils.wxRequestPayment(res.data.payinfo,
              //支付成功回调
              function (wxres) {
                
                utils.wxshowToast("支付成功！", "none", 1500);

                
                setTimeout(function () {
                  console.log("订单id：", that.data.orderid);
                  wx.navigateTo({
                    // url: '/pages/order/list/list',
                    url: '/pages/order/show/show?id=' + that.data.orderid + '&status=4' + '&isaccount=1',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }, 1500);
              },
              //取消支付回调
              function (res) {
                that.cancelPayment(orderNum, usertoken);
                that.setData({
                  btndisable: false
                })
              },
              //支付失败回调
              function (res) {
                utils.wxshowToast(res.errMsg);
                that.setData({
                  btndisable: false
                })
              });
          }
          else { //否则，表明礼品抵扣完订单总额，直接支付成功
            utils.wxshowToast("支付成功！", "none", 1500);
            setTimeout(function () {
              console.log("订单id：", that.data.orderid);
              wx.navigateTo({
                // url: '/pages/order/list/list',
                url: '/pages/order/show/show?id=' + that.data.orderid + '&status=4' + '&isaccount=1',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }, 1500);
          }

        } else {
          utils.wxshowToast("支付参数不完整，请与技术联系！", "none");
          that.setData({
            btndisable: false
          })
        }
        
      }, function(res) {
        utils.wxshowToast(res.error, "none");
        that.setData({
          btndisable: false
        })
      }, 'POST');
    }
  },

  //取消支付的回滚操作
  cancelPayment: function(orderNum, userToken) {
    var apiUrl = app.globalData.webUrl + "/tenpay/Cancel";
    var params = {
      orderNum: orderNum,
      userToken: userToken
    };
    //发起取消支付的请求
    utils.netRequest(apiUrl, params, function(res) {
      utils.wxshowToast("您已取消了支付！", "none", 3000);
    }, function(res) {
      utils.wxshowToast(res.error);
    }, "POST", false);
  },

  togoodsdetail: function(e) {

    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/goods/show/show?id=" + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // account: function() {

  //   if (this.data.address == '') {
  //     // util.wxshowToast("请填写收货地址", "none", 1000);
  //     wx.showModal({
  //       title: '',
  //       content: '您还没收货地址，是否新建一个？',
  //       showCancel: true,
  //       cancelText: '取消',
  //       cancelColor: '#000',
  //       confirmText: '确定',
  //       confirmColor: '#000',
  //       success: function (res) {
  //         if (res.confirm) {
  //           wx.navigateTo({
  //             // url: '/pages/user/address/address/address?isaccount=1',
  //             url: '/pages/user/address/add_address/add_address?id=0' + "&isaccount=0",
  //             success: function (res) { },
  //             fail: function (res) { },
  //             complete: function (res) { },
  //           })
  //         } else {

  //         }

  //       },
  //       fail: function (res) { },
  //       complete: function (res) { },
  //   })
  //   console.log("此处设立支付api")
  //   }
  // },
  onLoad: function(options) {
    wx.removeStorageSync("invoiceid")


    var that = this;

    wx.getSystemInfo({
      success: function(res) {
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



    console.log("是不是iphonex：" + app.globalData.isIPX)
    if (app.globalData.isIPX == 1) {
      // console.log(213213213213)
      that.setData({
        isIPX: true
      })
    }



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
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  loadingDatatop: function(isShowLoading) {
    var that = this;
    that.requestDataList(isShowLoading);
    that.getinvoice(isShowLoading);
    that.requestcartsList(isShowLoading)
  },

  getinvoice: function() {
    var that = this;
    var invoiceid = utils.getStorageSync("invoiceid");
    // console.log(1111111111111)
    // console.log(invoiceid)
    if (invoiceid != "") {
      var apiUrl = app.globalData.webUrl + "/user/GetInvoice";
      var usertoken = utils.getStorageSync("userToken");
      var params = {
        usertoken: usertoken,
        id: invoiceid
      };
      //手动显示加载框
      utils.wxShowLoading("请稍候...", true);
      // utils.netRequest(apiUrl, params, function(res) {

        var res = datas.invoiceincart
        var list = res.data;
        if (list == "") {
          that.setData({
            invoice: {
              "type": 0,
              "title": "不开发票"
            }
          })
        } else {
          that.setData({
            invoice: list[0]

          })
        }
        // console.log(list[0].type)

        //手动关闭加载提示
        utils.wxHideLoading();
        //手动停止刷新
        wx.stopPullDownRefresh();
      // }, null, 'GET');


    } else {
      that.setData({

        invoice: {
          "type": 0,
          "title": "不开发票"
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      hidemodal: true
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})

//