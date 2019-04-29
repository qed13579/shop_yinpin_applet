// pages/goods/detail/detail.js
const utils = require("../../../utils/util.js");
const datas = require("../../../utils/data.js");
const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js'); //string 转HTML

const common = require("../../../utils/common.js");
const enums = require("../../../utils/enums.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentlist: [],
    pageNo: 1,
    hasMore: true,
    hasRefesh: false,
    hidden: true,
    isHasData: true, //默认有数据
    currentTab: 0, //预设当前项的值
    currentTab: 0, //预设当前项的值
    status: 2,
    state: 1,
    arr: [],
    Id: 3,
    Sign: "",
    Img: "",
    Contents: "",
    Reads: "",
    Time: "",
    Likes: "",
    Pull: "",
    CommentNum: "",
    collectioncount: 0,
    shareObj: null, //分享对象
    title: "", //默认分享标题
    imageUrl: "", //分享默认图片
    path: "", //默认跳转路径
    winHeight: 0,
    rpxR: 0,
  },
  getNewsData: function(isShowLoading) {
    var that = this;
    that.setData({
      showSkeleton: true,
    })
    var apiUrl = app.globalData.webUrl + "/MallProduct/GetMallProduct";
    var paramrData = {
      id: that.data.Id
    }
    //显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    //网络请求数据
    // utils.netRequest(apiUrl, paramrData, function(res) {
      var res = datas.productdetail
      var news = res.data;
      // var time = news.time.substring(0, news.time.lastIndexOf(' '));
      //that.setData({
      // Id: news.id,
      // Sign: news.sign,
      // title: news.title,
      // Img: news.img,
      // imageUrl: news.img,//分享默认图片
      //Contents: news.descs,
      // Reads: news.reads,
      // // Time: time,
      // Likes: news.likes,
      // Pull: news.pull,
      // CommentNum: news.commentNum,
      // collectioncount: news.collectioncount,
      //})
      // common.getShareData(enums.shareType.Article, that.data.Id, that, function (res) {
      //   that.setData({
      //     shareObj: res
      //   })
      // })
      //设置分享内容
      var obj = new Object({
        title: news.title + "-商品详情",
        // path: utils.getCurrentPageUrl(),
        path: that.data.path,
        imageUrl:""
      });
      that.setData({
        shareObj: obj,
       
      });

      
      WxParse.wxParse('contents', 'html', news.descs, that, 0);
      //
      // setTimeout(function() {
        that.setData({
          hidden: false, //是否隐藏文章内容
          showSkeleton: false
        });
        //隐藏加载款
        // if (isShowLoading) utils.wxHideLoading();
      // }, 100);
    // }, null, "GET");
  },


  requestDataList: function(isShowLoading) {

    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/commnetList";
    var id = that.data.Id
    var pageNo = that.data.pageNo
    // var usertoken = utils.getStorageSync("userToken");
    // var token = app.globalData.initToken;
    var params = {
      sounid: id,
      page: pageNo
    };
    if (isShowLoading) utils.wxShowLoading("请稍候...", true);

    // utils.netRequest(apiUrl, params, function(res) {
      var res = datas.comment
      var data = res.data.list
      // var data = datas.comment.data.list
      // var res = datas.comment
      // console.log(data)
      that.setData({
        arr: res
      })
      var list = [];
      if (data.length > 0) {



        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          var obj = new Object({
            "img": item.img,
            "name": item.name,
            "content": item.contents,
            // "status": item.status,

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
          commentlist: list,
        });
        // console.log(that.data.commentlist)
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
      } else {
        that.setData({
          commentlist: that.data.commentlist.concat(list),
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
  state: function(e) {
    var state = e.target.dataset.state;
    this.setData({
      state: state
    })
    // console.log(state)
  },
  swichNav: function(e) {


    var status = e.target.dataset.status;

    this.setData({

      status: status,
      hasMore: false,
      pageNo: 1,
      isHasData: false,
      hidden: true,
    })

    // console.log(status)
    this.loadingDatatop(true)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  loadingDatatop: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
    if(that.data.status==2){
      that.requestDataList(isShowLoading);
    }
  
    if (that.data.status == 1){
    that.getNewsData(isShowLoading);
    }
    } else {
      app.updateUserInfoCallback = res => {
        if (that.data.status == 2) {
          that.requestDataList(isShowLoading);
        }

        if (that.data.status == 1){
          that.getNewsData(isShowLoading);
        }


      }

    }

  },
  onLoad: function(options) {
    console.log(options)
    var that=this;
    this.setData({
      status: options.status,
      Id: options.id,
      path: options.path + "?id="+options.id
    })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //调用方法传相应参数
    that.loadingDatatop(true);
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */


  onPullDownRefresh: function() {
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
    that.requestDataList(false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    console.log("分享的内容：",that.data.shareObj)
    //返回分享对象
    return utils.shareAppMessage(that.data.shareObj, function(res) {
      // console.log(res);
    });
 
  },
  lower: function() {
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
      that.requestDataList(false);
    }

  },
})