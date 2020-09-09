var app = getApp();
// pages/calender/calender.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateData: [{month: 9, day: 24, topInfo: "test", bottomInfo: "nonono"}],
    xfBottom: 0,
    optionAdd: [{ name: '微信', icon: 'wechat' }],
    showAdd: false,
    ydHeight: '800rpx',
    x: 250,
    y: 0,
    rdScrollTop: 0,
    aa: true,
    toView: 'demo1',
    // minDate: new Date(2010, 0, 1).getTime(),
    maxDate: new Date().getTime(),
    minDate: new Date().getTime(),
    defaultDate: new Date().getTime(),
    title: "2010年1月",
    today: 1,
    lastDay: {year: 2020, month: 1},
    formatter(day) {
      let now = new Date();
      let today = now.getDate();
      let thisMonth = now.getMonth() + 1;
      
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      const year = day.date.getFullYear()

      
      // 从云数据库获取选择月日历数据
      let k = `${year}-${month}-v2`
      let data
      try{
        data = wx.getStorageSync(k)
        // console.log('get count')
        if(!data){
          throw "data为空"
        }
      }catch(err){
        const db = wx.cloud.database()
        db.collection('calendar')
          .where({
            year: year,
            month: month
          })
          .field({
            day: true,
            topInfo: true,
            bottomInfo: true,
            month: true,
            news: true,
            year: true,
          })
          .orderBy('day', 'desc')
          .skip(0).limit(10)
          .get({
            success: function(res) {
              data = res.data
              wx.setStorage({
                data: res.data,
                key: k
              }) 
            }
          })
      }finally{
        if(data){
          data.map(v => {
            if (v.month === month && v.year === year) {
              if (date === v.day) {
                day.topInfo = `●${v.topInfo}`;
                day.bottomInfo = v.bottomInfo
              } 
              if (date === today && thisMonth === month) {
                day.text = '今天';
              }
            }
          })
        }
      }
      return day
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    this.setData({minDate: new Date(year, month, 1).getTime(), maxDate: new Date(year, month+1, 0).getTime()})
    this.setData({title: `${year}年${month+1}月`})
    this.setData({lastDay: {year: year, month: month+1}})

    wx.getSystemInfo({
      success: (res) => {
        console.log('system', res)
        this.setData({
            x: res.screenWidth,
            y: res.screenHeight,
            xfBottom: res.screenHeight - res.statusBarHeight - res.windowHeight
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    setTimeout(function(){
      let query = wx.createSelectorQuery()
      query.select('#rd').boundingClientRect(res => {
        // console.log("获取热点顶部距离", res)
        that.setData({rdScrollTop: res.top})
      }).exec()
    },  100)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  onClickRight: function () {
    console.log('feifei right', app.globalData.userInfo)
    let year = this.data.lastDay.year
    let month = this.data.lastDay.month
    // this.setData({maxDate: new Date(year, month+1, 0).getTime()})
    this.setData({minDate: new Date(year, month, 1).getTime(), maxDate: new Date(year, month+1, 0).getTime()})
    this.setData({title: `${year}年${month+1}月`})
    this.setData({lastDay: {year: year, month: month+1}})
    console.log('right', this.data.lastDay)
  },
  onClickLeft: function () {
    let year = this.data.lastDay.year
    let month = this.data.lastDay.month
    this.setData({minDate: new Date(year, month-2, 1).getTime(), maxDate: new Date(year, month-1, 0).getTime()})
    this.setData({title: `${year}年${month-1}月`})
    this.setData({lastDay: {year: year, month: month-1}})
    console.log('left', this.data.lastDay)
  },
  selectDate: function (v) {
    let d = 'item'+v.detail.getDate()
    this.setData({toView: d})
    console.log('vvv', d, v.detail.getDate(), v)
    wx.pageScrollTo({
      scrollTop: this.data.rdScrollTop,
      duration: 300
    });
  },
  openData: function () {
    console.log(1111)
    this.setData({aa: false})
  },
  tap: function(){
    console.log(this.data.rdScrollTop)
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    this.setData({minDate: new Date(year, month, 1).getTime(), maxDate: new Date(year, month+1, 0).getTime()})
    this.setData({title: `${year}年${month+1}月`})
    this.setData({lastDay: {year: year, month: month+1}})
    this.setData({defaultDate: new Date().getTime()})
  },
  // 展开要点
  zkyd: function(){
    let h = this.data.ydHeight === '800rpx' ? '100%' : '800rpx'
    console.log('hhh', h, this.ydHeight)
    this.setData({ydHeight: h})
    if(h === '800rpx'){
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },
  openAdd: function(){
    this.setData({showAdd: true})
  },
  closeAdd: function(){
    this.setData({showAdd: false})
  },
  setTouchMove: function(e){
    console.log('setTouchMove', e)
  },
})