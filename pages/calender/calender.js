import Toast from '../../weapp/toast/toast';
const { getDateData } = require('../../utils/util.js');
// var app = getApp();


let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()
var minDate = new Date(year, month, 15).getTime()
var maxDate = new Date(year, month+1, 0).getTime()
var v = `${date.getDate()}-${date.getHours()}`

// pages/calender/calender.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    touch: {x: 0, y: 0},
    windowHeight: 0,
    windowWidth: 0,
    dateData: [],
    xfBottom: 0,
    optionAdd: [
      // { name: '分享好友', icon: 'wechat' }, 
      { name: '日记', icon: '/image/note.png' },],
    showAdd: false,
    ydHeight: '800rpx',
    x: 0,
    y: 0,
    rdScrollTop: 0,
    aa: true,
    toView: 'demo1',
    minDate: minDate,
    maxDate: maxDate,
    defaultDate: new Date().getTime(),
    title: "2010年1月",
    today: 1,
    lastDay: {year: 2020, month: 1},
    selectDay: '1997-11-11',
    formatter(day) {
      let now = new Date();
      let today = now.getDate();
      let thisMonth = now.getMonth() + 1;
      
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      const year = day.date.getFullYear()
      
      let k = `${year}-${month}-${v}`
      let data = wx.getStorageSync(k)
      if(!data || typeof data === 'string'){
        // console.log("data为空")
        return day
      } else {
        // console.log("formdata data")
        data.map(v => {
          if (v.month === month && v.year === year) {
            if (date === v.day) {
              if(v.topInfo){
                day.topInfo = `●${v.topInfo}`;
              }
              day.bottomInfo = v.bottomInfo
            } 
            if (date === today && thisMonth === month) {
              day.text = '今天';
            }
          }
        })
      }
      return day
    }
  },

  watch: {
    dateData: function(newValue){
      console.log("new value", newValue)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    
    this.setData({title: `${year}年${month+1}月`})
    this.setData({lastDay: {year: year, month: month+1}, selectDay: `${year}-${month+1}-${day}`})

    // this.setData({
    //   windowHeight: wx.getSystemInfoSync().windowHeight,
    //   windowWidth: wx.getSystemInfoSync().windowWidth
    // })
    wx.getSystemInfo({
      success: (res) => {
        console.log('system', res)
        this.setData({
            x: res.screenWidth * 0.85,
            y: res.screenHeight,
            // xfBottom: res.screenHeight - res.statusBarHeight - res.windowHeight
            xfBottom: 0,
            windowHeight: res.windowHeight - res.statusBarHeight - 44,
            windowWidth: res.windowWidth
        });
      }
    })
    // 从云数据库获取选择月日历数据
    let that = this
    getDateData(year, month, v).then(function(res){
      let dateData = res || []
      that.setData({dateData: dateData})
      that.setData({minDate: new Date(year, month, 1).getTime(), maxDate: new Date(year, month+1, 0).getTime()})
      that.setData({ydHeight: dateData.length > 4 ? '800rpx' : '100%'})
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
    
    let date = new Date()
    v = `${date.getDate()}-${date.getHours()}`
    console.log("on show", date, v)
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
    console.log('share!!!')
  },

  onClickRight: function () {
    // 2020 12 1 ---> 2021 1 1 00
    let limitDate = new Date(2020, 12, 1).getTime()
    let year = this.data.lastDay.year
    let month = this.data.lastDay.month
    // if(new Date(year, month+1, 0).getTime() >= limitDate) {
    //   Toast('后面没有了~');
    //   return false
    // }
    if (month === 12) {
      year += 1
      month = 0
    }

    this.setData({title: `${year}年${month+1}月`})
    this.setData({lastDay: {year: year, month: month+1}})
    console.log('right', this.data.lastDay, v, year, month)
    // 从云数据库获取选择月日历数据
    let that = this
    getDateData(year, month, v).then(function(res){
      let dateData = res || []
      that.setData({dateData: dateData})
      that.setData({minDate: new Date(year, month, 1).getTime(), maxDate: new Date(year, month+1, 0).getTime()})
      that.setData({ydHeight: dateData.length > 4 ? '800rpx' : '100%'})
    })

  },
  onClickLeft: function () {
    let limitDate = new Date(2020, 8, 0).getTime()
    let year = this.data.lastDay.year
    let month = this.data.lastDay.month
    // let left = new Date(year, month, 0).getTime() - 3600 * 24 * 1000
    // console.log('last get time', year, month)
    if(month === 1) {
      year -= 1
      month = 13
    }

    // if(new Date(year, month-2, 1).getTime() <= limitDate) {
    //   Toast('前面没有了~');
    //   return false
    // }

    this.setData({title: `${year}年${month-1}月`})
    this.setData({lastDay: {year: year, month: month-1}})
    console.log('left', this.data.lastDay)
    // 从云数据库获取选择月日历数据
    let that = this
    getDateData(year, month-2, v).then(function(res){
      let dateData = res || []
      that.setData({dateData: dateData})
      that.setData({minDate: new Date(year, month-2, 1).getTime(), maxDate: new Date(year, month-1, 0).getTime()})
      that.setData({ydHeight: dateData.length > 4 ? '800rpx' : '100%'})
    })
  },
  selectDate: function (v) {
    let d = 'item'+v.detail.getDate()
    this.setData({toView: d, selectDay: `${v.detail.getFullYear()}-${v.detail.getMonth()+1}-${v.detail.getDate()}`})
    console.log('vvv', d, v.detail.getDate(), v, this.data.dateData, v.detail.getFullYear(), 
    v.detail.getMonth(), v.detail.getDate(), this.data.selectDay)
    this.data.dateData.map(val=>{
      if(val.day === v.detail.getDate()){
        wx.pageScrollTo({
          scrollTop: this.data.rdScrollTop,
          duration: 300
        });
      }
    })
  },
  openData: function () {
    this.setData({aa: false})
  },
  // 点击今按钮回到日历当天
  tap: function(){
    console.log(this.data.rdScrollTop)
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    this.setData({selectDay: `${year}-${month+1}-${day}`})
    this.setData({title: `${year}年${month+1}月`})
    this.setData({lastDay: {year: year, month: month+1}})
    this.setData({defaultDate: new Date().getTime()})
    // 从云数据库获取选择月日历数据
    let that = this
    getDateData(year, month, v).then(function(res){
      that.setData({dateData: res || []})
      that.setData({minDate: new Date(year, month, 1).getTime(), maxDate: new Date(year, month+1, 0).getTime()})
    })
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
  onSelect(event) {
    let d = new Date(this.data.selectDay)
    let week = d.getDay()
    console.log("week", week)
    // 节假日不显示操盘页面
    if([0, 6].indexOf(week)>=0){
      wx.showToast({
        title: '节假日休息！',
        icon: 'error',
        duration: 2000
      })
      
    } else {
      Toast(event.detail.name);
      let that = this
      setTimeout(function(){
        console.log("to", that.data.selectDay)
        wx.navigateTo({
          url: `../component/pages/note/note?id=1&date=${that.data.selectDay}`,
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            acceptDataFromOpenedPage: function(data) {
              console.log('aaaaaa', data)
            },
            someEvent: function(data) {
              console.log('some', data)
            }
          },
          success: function(res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
          }
        })
      }, 100)

    }
    
  },
  moveSus(e) {
    console.log("move sus", e)
  },
  touchStart: function(e) {
    this.setData({
      "touch.x": e.changedTouches[0].clientX,
      "touch.y": e.changedTouches[0].clientY,
    })
    console.log("touch start", e, this.data.touch)

  },
  touchEnd: function(e) {
    console.log("touch end", e)
    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY
    let startX = this.data.touch.x
    let startY = this.data.touch.y
    if (startX - x < -50 && Math.abs(startY - y) < 50) {
      console.log("left")
      this.onClickLeft()
    } else if (startX - x > 50 && Math.abs(startY -y) < 50) {
      console.log("right")
      this.onClickRight()
    }
  },
})