import Toast from '../../weapp/toast/toast';
const { getDateData } = require('../../utils/util.js');
// var app = getApp();


let date = new Date()
let year = date.getFullYear()
let month = date.getMonth()
var minDate = new Date(year, month, 15).getTime()
var maxDate = new Date(year, month+1, 0).getTime()
var v = `${date.getDate}-${date.getHours}`

// pages/calender/calender.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateData: [],
    xfBottom: 0,
    optionAdd: [{ name: '分享好友', icon: 'wechat' }, 
                { name: '日记', icon: '/image/note.png' },],
    showAdd: false,
    ydHeight: '800rpx',
    x: 250,
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
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    
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
    console.log("on show", date)
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
    // 2020 12 1 ---> 2021 1 1 00
    let limitDate = new Date(2020, 12, 1).getTime()
    let year = this.data.lastDay.year
    let month = this.data.lastDay.month
    if(new Date(year, month+1, 0).getTime() >= limitDate) {
      Toast('后面没有了~');
      return false
    }

    this.setData({title: `${year}年${month+1}月`})
    this.setData({lastDay: {year: year, month: month+1}})
    console.log('right', this.data.lastDay)
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
    if(new Date(year, month-2, 1).getTime() <= limitDate) {
      Toast('前面没有了~');
      return false
    }

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
    this.setData({toView: d})
    // console.log('vvv', d, v.detail.getDate(), v, this.data.dateData)
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
  tap: function(){
    console.log(this.data.rdScrollTop)
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    // this.setData({minDate: new Date(year, month, 1).getTime(), maxDate: new Date(year, month+1, 0).getTime()})
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
})