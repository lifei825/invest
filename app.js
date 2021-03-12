//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: 'test2-5hlbd', 
        traceUser: true,
      })

      // 调用云函数
				wx.cloud.callFunction({
				  name: 'add',
				  data: {"a": 123},
				  success: res => {
					// debugger
          console.log('[云函数] [login] user openid: ', res.result.openid)
          console.log('openid', res.result)
				  },
				  fail: err => {
					console.error('[云函数] [login] 调用失败', err)
				  }
				})
    }

    // 登录
    wx.login({
      success: res => {
        console.log('wx login res', res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if(res.code === 1){
          console.log(res.code)
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',//微信服务器获取appid的网址 不用变
            method:'post',//必须是post方法
            data:{
              js_code:res.code,
              appid:'wxdadaddceweed',//仅为实例appid
              secret:'edajdisajisdincaksaksokdoakadp',//仅为实例secret
              grant_type:'authorization_code'
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            success:function(response){
              console.log('get openid', response.data)
              wx.setStorageSync('app_openid', response.data.openid); 将openid存入本地缓存
              wx.setStorageSync('sessionKey', response.data.session_key)//将session_key 存入本地缓存命名为SessionKey
            }
          })
        }else{
          console.log("登陆失败");
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log('user info', res.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})