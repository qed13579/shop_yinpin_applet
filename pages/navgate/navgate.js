// pages/navgate/navgate.js



Page({

  /**
   * 页面的初始数据
   */
  data: {

    navcontent:"快速导航",
    nav_icon:"<<",
    rpxR:1,
    animationData:{},
    animationData2: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var that=this;

    // wx.getSystemInfo({
    //   success: function (res) {
    //     var clientHeight = res.windowHeight,
    //       clientWidth = res.windowWidth,
    //       rpxR = 750 / clientWidth;
    //     var calc = clientHeight * rpxR;
    //     that.setData({
    //       winHeight: clientHeight,
    //       rpxR: rpxR
    //     });
    //   }
    // });


  },

  onShow: function () {
    var that = this;

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
  nav_move:function(){
    var that=this;
    if (that.data.navcontent =="快速导航"){
      that.setData({
        navcontent: "收起",
        nav_icon: ">>"
      })
      that.translateX()
    }else{
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */




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