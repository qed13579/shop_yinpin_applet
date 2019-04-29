const app = getApp();
const utils = require("../../../../utils/util.js");
const datas = require("../../../../utils/data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    hidden: true, //是否显示底部地区选择器
    address: "",
    // phone: "",
    name: "",
    detail: null,
    code: "",
    region: ['广东省', '广州市', '海珠区'],
    name: "",
    mobile: "",
    code: "",
    isDefault: false,
    isaccount:""

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("====", options);
    var id = options.id;
    that.setData({
      id: id,
      isaccount: options.isaccount
    })
    that.loaddingData(true);
    that.copy();
  },


  copy: function () {
    var that = this;
    console.log("copy")
    wx.getClipboardData({
      complete: function (res) {
        console.log(res)
        var str = utils.getTrim(res.data)
        if (str.length < 100) {


          var comma = str.split(",");
          // var vertical = str.split("|");
          // var space = str.split(" ");
          // var reg = RegExp(/\s/);
          // var more = RegExp(/[^\s;]+\s + [^\s;]/);
          var other = RegExp(/[,|" "|，]/);//判断是否有逗号或空格的正则表达试

          var judge = str.match(other)//判断复制面板是否有逗号或空格

          if (judge) {//如果有有逗号或空格
            var useful = []//初始化地址数组
            var usephone = []//初始化手机数组
            var usename = []//初始化用户名数组
            var usepostalc = []//初始化邮编数组
            var space = str.split(judge[0]); //用逗号或空格分隔开复制面板的内容
            for (var a = 0; a < space.length; a++) {//循环以空格分割后的数组
              // 内蒙古太原市花都区新华街123312 pl 13522248112 小明 510800




              //用正则划分特定区域=====================================
              var reg = /.+?(省|市|自治区|自治州|县|区)/g;//划分的正则
              var useprovince = space[a].match(reg)//用正则划分特定区域
              if (useprovince) {//用正则划分特定区域是否成功
                if (useprovince.length == 3) {//用正则划分特定区域是否为省市区三条是的话录入省市区和街道
                  console.log(useprovince.length)

                  var thelast = useprovince[useprovince.length - 1];//地区字符串中的区
                  var street = RegExp(thelast);//地区字符串区的长度

                  var usestreet = space[a].match(street).index + thelast.length//地区字符串街道前的长度
                  var truestreet = space[a].substring(usestreet, space[a].length)//街道
                  console.log(truestreet)
                  useful.push(useprovince)
                } else {//不是省市区三条的话不录入省市区只录入街道
                  console.log(useprovince.length)

                  var thelast = useprovince[useprovince.length - 1];//地区字符串中的区
                  var street = RegExp(thelast);//地区字符串区的长度

                  var usestreet = space[a].match(street).index + thelast.length//地区字符串街道前的长度
                  var truestreet = space[a].substring(usestreet, space[a].length)//街道
                  console.log(truestreet)

                }

              }
              // var city = RegExp(/["市"]/);
              //划分特定区域结束=====================================




              //用正则划分手机号码=====================================
              var phonereg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;//划分的正则
              if (phonereg.test(space[a])) {//用正则划分没问题的话
                console.log("手机：", space[a])
                usephone.push(space[a])
              }
              //用正则划分手机号码=====================================




              //用正则划分姓名=====================================
              var name = /^[\u4E00-\u9FA5A-Za-z]+$/;//划分的正则

              // var phone = space[a].match(reg)//用正则划分特定区域

              if (name.test(space[a])) {//用正则划分没问题的话
                console.log("姓名：", space[a])
                usename.push(space[a])
              }
              //用正则划分姓名=====================================



              //用正则划分邮政编码=====================================
              var postalc = /^[0-9]{6}$/;//划分的正则
              if (postalc.test(space[a])) {//用正则划分没问题的话
                console.log("邮政编码：", space[a])
                usepostalc.push(space[a])
              }
              //用正则划分邮政编码=====================================
            }




            console.log("分割前:", judge, "分割后:", space, "特定区域", useful, "街道：", truestreet, "手机：", usephone, "姓名：", usename, "邮政编码：", usepostalc)
            // 包含

            //
            if (usephone != "") {
              wx.showModal({
                title: '',
                content: '检测到您的剪切板有地址,是否用剪切板的地址信息？',
                success: function (res) {
                  if (res.confirm) {
                    that.setData({
                      region: useful[0],
                      detail: truestreet,
                      mobile: usephone[0],
                      name: usename[0],
                      code: usepostalc[0]
                    })
                  }
                }
              })
            }



            //

          }
        }
      }
    })
  },
  changebtn: function(e) {
    var that = this;
    var isDefault = that.data.isDefault;
    that.setData({
      isDefault: !isDefault
    })
  },

  loaddingData: function(isShowLoading) {
    var that = this;
    if (app.globalData.isLogin) {
      that.todetail(that.data.id);
    } else {
      app.updateUserInfoCallback = res => {
        that.todetail(that.data.id);
      }
    }
  },

  onShow: function() {
    var that = this;

  },
  //编辑地址的事件
  todetail: function(id) {
    var that = this;
    console.log("id==", id)
    //判断传入的id是0就是新增地址，直接不做任何操作
    if (id == 0) {
      return;
    }
    var apiUrl = app.globalData.webUrl + "/user/GetReceipt";
    var usertoken = utils.getStorageSync("userToken");
    //var id = that.data.id;
    var params = {
      usertoken: usertoken,
      rId: id
    };
    // utils.netRequest(apiUrl, params, function(res) {

      var res = datas.addressedit
      console.log("res", res)
      var obj = res.data[0];
      // that.setData({
      //   address: list
      // });

      var arr = obj.address.split(",");
      console.log("地址", arr)
      that.setData({
        detail: arr[arr.length - 1]
      })
      arr.splice(arr.length - 1, 1);
      console.log("地址2", arr)
      that.setData({
        region: arr,
        name: obj.name,
        mobile: obj.mobile,
        code: obj.code,
        isDefault: obj.isdefault
      })

      //手动关闭加载提示
      //if (isShowLoading) utils.wxHideLoading();
      //手动停止刷新
      //wx.stopPullDownRefresh();
    // }, null, 'GET');
  },

  //获取电话号码
  getphone: function(e) {
    // console.log(e);
    this.data.mobile = e.detail.value;
  },
  getcode: function(e) {
    // console.log(e);
    this.data.code = e.detail.value;
  },

  getname: function(e) {
    // console.log(e);
    this.data.name = e.detail.value;
  },
  //获取地区信息
  getaddress: function(e) {
    var that = this;
    console.log(e);
    var address = e.detail.value;
    //转换地址的格式text = text.replace(/\s/ig,'');
    that.data.address = address.replace(/\s/ig, '');
    console.log(that.data.address);
  },
  //获取详细地址信息
  getDetail: function(e) {
    console.log(e);
    var that = this;
    console.log(e);
    that.data.detail = e.detail.value;
  },

  toPpreserve: function(isShowLoading) {
    var that = this;
    var apiUrl = app.globalData.webUrl + "/user/EditReceipt";
    var usertoken = utils.getStorageSync("userToken");
    var id = that.data.id;
    var code = that.data.code;
    var mobile = that.data.mobile;
    var name = that.data.name;
    var detail = that.data.detail;
    var address = that.data.region.toString() + "," + detail;
    var isDefault = that.data.isDefault;
    var params = {
      usertoken: usertoken,
      rId: id,
      code: code,
      mobile: mobile,
      name: name,
      address: address,
      isDefault: isDefault
    };
    console.log(detail);
    //手动显示加载框
    // if (isShowLoading) utils.wxShowLoading("请稍候...", true);
    if (name != null && address != null && code != null && detail) {
      
        if (utils.validatemobile(mobile)) {
          utils.netRequest(apiUrl, params, function(res) {
            console.log("添加成功后返回：",res)

            // 
            console.log("是否从结算页跳过来的：", that.data.isaccount)
            if (that.data.isaccount==0){
              utils.setStorageSync("addressId", res.data);
              wx.navigateBack({
                delta: 1
              })
            }else if(that.data.isaccount==1){
              utils.setStorageSync("addressId", res.data);
              wx.navigateBack({
                delta: 2
              })
            }else{
                wx.showToast({
                  title: '添加出错',
                  icon: 'none',
                  image: '',
                  duration: 0,
                  mask: true,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
            }

            //手动关闭加载提示
            if (isShowLoading) utils.wxHideLoading();
            //手动停止刷新
            wx.stopPullDownRefresh();
          }, function (res){
            console.log("错误信息",res)

          wx.showToast({
            title: res.error,
            icon:"none"
          })
          } ,'GET');
        }
     
    } else {
      utils.wxshowToast("请输入完整的地址信息")
    }
  },
  //时间选择器的方法
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  }
})