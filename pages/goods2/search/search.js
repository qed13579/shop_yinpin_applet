// pages/search/search.js
var app = getApp();
const searchList = require("../../../utils/data.js");
const utils = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seachinfo: '稻花香',
    list: [],
    history: [],
    // history: [],
    // history:'',
    guess: ["饭", "米", "花生油", "饼干"],
    nogoods:false,
    pageNo:1,
    hasMore:true,

    hasRefesh: false,
    hidden: true,
    isHasData: true, //默认有数据
    // menu: [],
    hasList: false,
    hidecontent:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    // that.setData({
    //   seachinfo: options.value
    // })
    //获取历史搜索存储信息
    var history = wx.getStorageSync('history');
    if (history) {
      this.setData({ history: history });
    }
  
    // that.loadingDatatop();

  },


  tocart: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    // console.log(id)
    var apiUrl = app.globalData.webUrl + "/MallProduct/ShopCar";
    var usertoken = utils.getStorageSync("userToken");
    var id = id;
    var params = { pId: id, usertoken: usertoken, count: 1 };
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    utils.netRequest(apiUrl, params, function (res) {
      utils.wxHideLoading();
      utils.wxshowToast("加入购物车成功", "success", 1000, null)

      //手动关闭加载提示

      //手动停止刷新
      // wx.stopPullDownRefresh();
      // that.cart(true);
    }, function () {
      utils.wxshowToast("加入购物车失败", "none", 1000, null)
    }, 'GET');

  },
  togoodshow: function (e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/show/show?id=' + id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  loadingDatatop: function () {
    var that = this;
    if (app.globalData.isLogin) {
      // that.hotsearch();
      that.seacrhList();

    } else {
      app.updateUserInfoCallback = res => {
        // that.hotsearch();
        that.seacrhList();
      }

    }

  },
  /**
     * 删除搜索框内的值
     */
  searchdelete: function (e) {

    this.setData({
      seachinfo: '',
      list: '',

      nogoods: false,
      hidecontent: true,
      pageNo: 1,
      hasMore: true,
      hasRefesh: false,
      hidden: true,
      isHasData: true, //默认有数据
      // menu: [],
      hasList: false,
    })
  },
  /**
   * 
   */
  onInput: function (e) {
    console.log("输入框内容："+e);
    var that = this;
    var value = e.detail.value;

    that.setData({
      seachinfo: value,
    })
  },
  /**
   *历史记录的删除
   */
  deleteall: function (e) {
    var that = this;
    var history = this.data.history;
    wx.showModal({
      title: '提示',
      content: '确定删除全部历史搜索',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          that.setData({
            history: []
          })
        } else if (res.cancel) {
        }
      }
    })
  },


  // hotsearch: function () {
  //   var that = this;
  //   var apiUrl = app.globalData.webUrl + "/home/GetAdData";
  //   var usertoken = utils.getStorageSync("userToken");

  //   var params = { usertoken: usertoken };
  //   //手动显示加载框

  //   utils.netRequest(apiUrl, params, function (res) {
  //     var list = res.data;
  //     that.setData({

  //       guess: list
  //     });
  //     //手动关闭加载提示
  //   utils.wxHideLoading();
  //     //手动停止刷新
  //     wx.stopPullDownRefresh();
  //   }, null, 'GET');
  // },


  seacrhgoods:function(){//搜索商品
    var that=this;
    var searchinfo = that.data.seachinfo;
    var apiUrl = app.globalData.webUrl + "/MallProduct/GetMallProductList";
    // var usertoken = utils.getStorageSync("userToken");
    var page=that.data.pageNo;
    console.log("当前的页数：" + page)
    var params = { key: searchinfo, page: page};
    //手动显示加载框
    utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function (res) {
    var res = searchList.searchList

      var data = res.data.list;
      var list = [];
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var obj = new Object({
            "img": item.img,
            "title": item.title,
            "price": item.price,
            "value": item.value,
            "id": item.id,
            // "pay": item.totalfee,
          });
          list.push(obj);
        }
      }
      console.log("当前的商品", list)
      // //如果 list 长度为 0，或翻到最后一页,则设置没有更多数据
      if (list.length == 0 || that.data.pageNo == res.data.totalpage) {
        that.setData({
          hasMore: false,
        })
      }

      // page 等于 1 表示首次加载或下拉刷新
      if (res.data.page == 1) {

        that.setData({
          list: list,
        });
        // console.log(that.data.list)
        // isHasData 默认是 false，即显示，
        // 只在第一次加载数据的时候，
        // 根据有无数据改变值，翻页不做改变
        if (list.length == 0) {
          that.setData({
            nogoods: true,
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
          list: that.data.list.concat(list),
        });
      }
      that.setData({
        history: wx.getStorageSync('history'),
        hidden: false,
        hasRefesh: false,
        hidecontent: false
      });
      //隐藏加载框
      utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, "GET");


  },


  seacrhList: function (e) {//把搜索的记录放到缓存中
    console.log("当前页数："+this.data.pageNO)
    var that = this;
    var searchinfo = that.data.seachinfo;
    var history = that.data.history;
    console.log(searchinfo);
    // console.log(history);
    if (searchinfo != null && searchinfo != undefined && searchinfo != '') {

      var lasthistory = history
      for (var i = 10; i >= 0; i++){
        
        var index = lasthistory.indexOf(searchinfo);
        if (index>-1){
          lasthistory.splice(index, 1);
          console.log(index)
          console.log(lasthistory)
          // break;
        }else{
          console.log(1)
          lasthistory.unshift(searchinfo);
          break;
        }
      }
   

      // var index = lasthistory.indexOf(5);

      // if (index > -1) {
      //   array.splice(index, 1);
      // }

      wx.setStorageSync('history', lasthistory)
      console.log(wx.getStorageSync('history'));

//此处写api
         that.seacrhgoods();
      //   utils.netRequest(apiUrl, params, function (res) {
      //     var list = res.data.list;
      //     // var list = searchList.searchList.data.list;



      //     if (list==""){
      //       that.setData({
      //        nogoods:true
      //       });
      //     }
      //     console.log("当前的商品",res)
      //     that.setData({
            
      //       history: wx.getStorageSync('history'),
      //       list: list
      //     });
      //     //手动关闭加载提示
      // utils.wxHideLoading();
      //     //手动停止刷新
      //     wx.stopPullDownRefresh();
      //   }, null, 'GET');



    } else {
      wx.showToast({
        title: '请输入搜索的内容',
        icon: 'none',
        duration: 1000//持续的时间
      })
    }
  },
  /**
   * 聚焦时触发
   */
  onfocus: function (e) {//点击搜索框时初始化全部内容
    var that = this;
    console.log(e);
    var list = that.data.list;
    that.setData({
      list: '',
      nogoods:false,
      hidecontent:true,
      pageNo: 1,
      hasMore: true,
      hasRefesh: false,
      hidden: true,
      isHasData: true, //默认有数据
      // menu: [],
      hasList: false,
    })
  },
  /**选择历史记录进行搜索
   */
  selectText: function (e) {
    var that = this;
    console.log(e);
    var value = e.currentTarget.dataset.value;
    that.setData({
      seachinfo: value
    })
  },

  onReachBottom: function () {
    var that=this;
    console.log("上拉翻页..." + that.data.hasMore);
    var that = this;
    //如果页面变量 hasMore 为 true，才执行翻页加载数据

    if (that.data.hasMore) {
      var nextPage = that.data.pageNo + 1;
      // console.log("页码：" + nextPage);

      that.setData({
        pageNo: nextPage,
      })
      //网络请求数据
      that.seacrhgoods();
    }

  },
})
