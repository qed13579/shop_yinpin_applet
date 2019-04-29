// pages/address/address.js
const app = getApp();
const utils = require("../../../../utils/util.js");
const datas = require("../../../../utils/data.js");
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
    isIPX: false,
    showSkeleton: true,
    isaccount: 0, //1表示是从结算页面跳过来的
    windowHeight: ''
  },
  //改变选中按钮状态
  changebtn: function(e) {
    var that = this;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    utils.setStorageSync("addressId", id);
    var selectedlist = that.data.selectedlist;
    //循环先设置全部为false
    for (let i in selectedlist) {
      selectedlist[i] = false;
    }
    // console.log("selectedlist", selectedlist);
    //获取当前被选中的状态
    var selected = selectedlist[id];
    selectedlist[id] = !selected;
    that.setData({
      selectedlist: selectedlist
    })
    //延迟0.1秒跳转至上一个页面
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 100);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    that.setData({
      isaccount: options.isaccount
    })
    console.log(app.globalData.isIPX);
    if (app.globalData.isIPX == 1) {
      that.setData({
        isIPX: true
      })
    }
    for (var i = 0; i < 30; i++) {
      that.data.items.push({
        isTouchMove: false //默认全隐藏删除
      })
    }
    that.setData({
      items: that.data.items
    })

    // that.loaddingData(true);

    wx.getSystemInfo({
      success: function(res) {
         // 获取可使用窗口高度
        console.log(res.windowHeight)
        //将高度乘以换算后的该设备的rpx与px的比例
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); 
        console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度

        that.setData({
          windowHeight: windowHeight,
        })
      }
    })
  },

  onShow: function() {
    var that = this;
    that.loaddingData(true);
  },

  loaddingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.getGetReceipt(isShowLoading);
    } else {
      app.updateUserInfoCallback = res => {
        that.getGetReceipt(isShowLoading);
      }
    }
  },
  /**
   * 获取收货地址的列表
   */
  getGetReceipt: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/GetReceipt";
    var usertoken = utils.getStorageSync("userToken");
    var params = {
      usertoken: usertoken
    };
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    // utils.netRequest(apiUrl, params, function(res) {



      var res = datas.address
      var list = res.data;
      //将是否默认的状态存在单独一个数组中{id:false}
      var selectedlist = {};
      for (var i = 0; i < list.length; i++) {
        var id = list[i].id
        var item = list[i].isdefault
        selectedlist[id] = item
        // selectedlist.push(item);
      }
      // console.log('selectedlist', selectedlist);
      var pid = utils.getStorageSync("addressId");
      console.log("pid", id);
      //判断是否缓存是否id，有的话设置其为true,默认勾选
      if (pid) {
        for (let i in selectedlist) {
          selectedlist[i] = false;
        }
        selectedlist[pid] = true;
      }

      that.setData({
        addressList: list,
        selectedlist: selectedlist,
        showSkeleton: false
      });
      //手动关闭加载提示
      if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      wx.stopPullDownRefresh();
    // }, null, 'GET');
  },
  /**
   * 编辑
   */
  editAdress: function(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/user/address/add_address/add_address?id=' + id + "&isaccount=" + this.data.isaccount,
    })
  },
  //选中返回上一页
  toback: function(e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    utils.setStorageSync("addressId", id);
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 100);

  },

  //删除地址事件
  todelete: function(e) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/DeleteReceipt";
    var id = e.currentTarget.dataset.id;
    var addressId = utils.getStorageSync("addressId");
    var usertoken = utils.getStorageSync("userToken");
    if (addressId != null && addressId == id) {
      wx.removeStorageSync("addressId");
    }
    var params = {
      usertoken: usertoken,
      id: id
    };
    utils.netRequest(apiUrl, params, function(res) {
      //删除完之后，本地及时更新数据显示
      that.loaddingData(true);
    }, null, "GET");

  },


  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function(v, i) {
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
    that.data.items.forEach(function(v, i) {
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
  tonewaddress: function() {
    wx.navigateTo({
      url: '/pages/user/address/add_address/add_address?id=0' + "&isaccount=" + this.data.isaccount,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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

})