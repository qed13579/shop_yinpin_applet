/**
 * 时间格式转换
 * IOS 无法格式化
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
  //+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getTrim = function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 时间戳转化成日期
 * num 时间戳
 * format 日期格式
 */
const formatUTCTime = function(num, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(num * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/**
 * json 请求封装
 * method POST 或 GET
 * url 接口地址
 * params  json 参数
 * succeed 成功回调
 * failed 失败回调
 */
const netRequest = function(url, params, succeed, failed, method, isShowLoading) {
  if (isShowLoading) {
    //开启加载提示框
    wxShowLoading("请稍候...", true);
  }
  wx.request({
    url: url,
    data: params, // 类型： Object/String/ArrayBuffer
    header: {
      'content-type': 'application/x-www-form-urlencoded' //'application/json' // 默认值
    },
    method: method, // GET POST 需大写
    success: res => {
      var data = res.data;
      console.log(data);
      //console.log("error_code=" + data.error_code + ",error=" + data.error);
      if (data.error_code == 0 || data.status == 200) {
        succeed(data);
      } else {
        if (failed != undefined || failed != null)
          failed(data);
      }
    },
    fail: res => {
      console.log("error_code=" + res.error_code + ",error=" + res.error);
    },
    complete: res => {
      if (isShowLoading) wxHideLoading(); //手动关闭加载提示
    }
  })
}

/**
 * 微信分享通用方法
 * obj 分享对象
 * callback 回调函数
 */
var shareAppMessage = function(obj, callback) {
  //设置菜单中的转发按钮触发转发事件时的转发内容
  var shareObj = {
    title: obj.title, //默认是小程序的名称(可以写slogan等)
    path: "/" + obj.path, //默认是当前页面，必须是以‘/’开头的完整路径
    //desc: descn,
    imageUrl: obj.imageUrl, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入imageUrl 则使用默认截图。显示图片长宽比是 5:4
    success: function(res) {
      // 转发成功之后的回调
      if (res.errMsg == 'shareAppMessage:ok') {
        wxshowToast("分享成功！");
        if (callback) callback(res);
      }
    },
    fail: function(res) {
      // 转发失败之后的回调
      if (res.errMsg == 'shareAppMessage:fail cancel') {
        // 用户取消转发
        wxshowToast("您取消了分享！");
      } else if (res.errMsg == 'shareAppMessage:fail') {
        // 转发失败，其中 detail message 为详细失败信息
        wxshowToast("分享失败！");
      }
    },
    complete: function(res) {
      // 转发结束之后的回调（转发成不成功都会执行）
      console.log("res.errMsg=" + res.errMsg);
    }
  }

  /**来自页面内的按钮的转发
   * 另一个是页面中具有属性open-type且其值为share的button。（注：必须是button组件，其他组件中设置 open-type="share" 无效）
  即：<button data-name="shareBtn" open-type="share">转发</button>
  注意：实际开发中会发现这个 button 自带有样式，当背景颜色设置为白色的时候还有一个黑色的边框，刚开始那个边框怎么都去不掉，后来给button加了一个样式属性 plain="true" 以后，再在样式文件中控制样式 button[plain]{ border:0 } ，就可以比较随便的自定义样式了，比如说将分享按钮做成一个图标等
   * */
  // if (options.from == 'button') {
  // var Sign = options.target.dataset.sign;
  // console.log(Sign);     // shareBtn
  // //此处可以修改 shareObj 中的内容
  // shareObj.path = '/pages/news/detail?sign=' + Sign;
  // shareObj.path = "/" + url;
  // }
  // 返回shareObj
  return shareObj;
}
/**
 * str:要绘制的字符串
 * canvas:canvas对象
 * initX:绘制字符串起始x坐标
 * initY:绘制字符串起始y坐标
 * lineHeight:字行高，自己定义个值即可
 * canvasWidth:画布宽度
 */
const canvasTextAutoLine = function(str, ctx, initX, initY, lineHeight, canvasWidth) {
  var lineWidth = 0;
  console.log("str.length=" + str.length)
  var lastSubStrIndex = 0;
  for (let i = 0; i < str.length; i++) {
    //ctx.measureText 在画布上输出文本之前，检查字体的宽度
    lineWidth += ctx.measureText(str[i]).width;

    //减去initX,防止边界出现的问题
    if (lineWidth > canvasWidth - initX) {
      ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
      initY += lineHeight;
      lineWidth = 0;
      lastSubStrIndex = i;
    }
    if (i == str.length - 1) {
      ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
    }
  }
  return initY;
}
/**
 * 显示消息提示框
 * msg 提示的内容
 * icon 图标，默认为"none",有效值 "success", "loading", "none"
 * duration 提示的延迟时间，单位毫秒，默认：2000
 */
const wxshowToast = function(msg, icon, duration, callback) {
  if (msg == undefined || msg == '' || msg == null)
    msg = "无提示文字";
  if (icon == undefined || icon == '' || icon == null)
    icon = "none";
  if (duration == undefined || duration == '' || duration == null)
    duration = 3000;
  wx.showToast({
    title: msg,
    icon: icon,
    duration: duration
  });
  if (callback)
    callback;
}

//显示确认框
const wxShowModal = function(title,content,success,cancel){
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if (res.confirm) {
        success(res);
      }else{
        cancel(res);
      }
    }
  })
}

/**
 * 显示加载框
 */
const wxShowLoading = function(title, mask) {
  wx.showLoading({
    title: title,
    mask: mask
  })
}

/**
 * 隐藏加载框
 */
const wxHideLoading = function() {
  wx.hideLoading();
}

/**
 * 发起微信支付。
 * obj 支付需要的参数
 * success 成功回调
 * fail 失败回调
 */
const wxRequestPayment = function(obj, success,cancel,fail) {
  wx.requestPayment({
    'timeStamp': obj.timeStamp,
    'nonceStr': obj.nonceStr,
    'package': obj.package,
    'signType': "MD5",
    'paySign': obj.paySign,
    'success': function(res) {
      console.log("errMsg=" + res.errMsg);
      success(res);
    },
    'fail': function(res) {
      console.log("errMsg=" + res.errMsg);
      if (res.errMsg == "requestPayment:fail cancel") {
        //wxshowToast("您已取消了支付！");
        cancel(res);
      } else {
        console.log("error_code" + res.error_code);
        fail(res);
      }
    },
    'complete':function(res){

    }
  })
}

/**
 * 设置本地缓存
 * key 键名
 * data 值
 */
const setStorageSync = function(key, data) {
  wx.setStorageSync(key, data);
}
/**
 * 获取本地缓存
 * key 键名
 */
const getStorageSync = function(key) {
  return wx.getStorageSync(key);
}

/**
 * 获取当前页面路径
 * 带参数的url
 */
const getCurrentPageUrl = function() {
  var pages = getCurrentPages(); //获取加载的页面
  var currentPage = pages[pages.length - 1]; //获取当前页面的对象
  var url = currentPage.route; //当前页面url
  var options = currentPage.options; //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?';
  for (var key in options) {
    var value = options[key];
    urlWithArgs += key + '=' + value + '&';
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);

  return urlWithArgs;
}
/**
 * 检验手机号码
 * @param mobile
 * @return true or false
 */
const validatemobile = function(mobile) {
  if (mobile.length == 0) {
    wxshowToast('请输入手机号！');
    return false;
  }
  if (mobile.length != 11) {
    wxshowToast('手机号长度有误！');
    return false;
  }
  var mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!mobileReg.test(mobile)) {
    wxshowToast('手机号有误！');
    return false;
  }
  return true;
}

/**
 * 邮箱正则表达验证
 * @param email
 * @return ture or false
 */
const validateEmail = function(email){
  if(email.length == 0){
    wxshowToast('请输入邮箱');
    return false;
  }
  var emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if(!emailReg.test(email)){
    wxshowToast('请输入合法的邮箱！');
    return false;
  }
  return true;
}

/**
 * 公开方法
 */
module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatUTCTime: formatUTCTime,
  netRequest: netRequest,
  shareAppMessage: shareAppMessage,
  canvasTextAutoLine: canvasTextAutoLine,
  wxshowToast: wxshowToast,
  wxShowModal: wxShowModal,
  wxRequestPayment: wxRequestPayment,
  setStorageSync: setStorageSync,
  getStorageSync: getStorageSync,
  wxShowLoading: wxShowLoading,
  wxHideLoading: wxHideLoading,
  getCurrentPageUrl: getCurrentPageUrl,
  validatemobile: validatemobile,
  validateEmail: validateEmail,
  getTrim: getTrim
}