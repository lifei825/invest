// pages/component/pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2022-03-12",
    editStatus: true,
    sms: 123,
    readonly: false,
    active: 0,
    steps: [],
    cp: [
      {name: '大盘预判', msg: 'ddadad'},
      {name: '今日开盘', msg: 'ddadad'},
      {name: '盘中记录', msg: 'ddadad'},
      {name: '午盘总结', msg: 'ddadad'},
      {name: '尾盘记录', msg: 'ddadaddadadadakdjabdakl'},
      {name: '操盘总结', msg: ''},
    ],
    activeNames: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload', options)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', {data: 'from note'});
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log('event on', data)
    })
    let steps = []
    for(let x=0;x<20;x++){
      steps.push({text: x, desc: 'aaa'})
    }
    this.setData({steps: steps})

    // 查看操盘状态msg是否为0， 为0则不打开折叠面板
    let actives = []
    let n = 0
    this.data.cp.map(rs=>{
      if (rs.msg.length>0){
        actives.push(n)
      }
      n+=1
    })
    this.setData({activeNames: actives})
    console.log(this.data.activeNames)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  onChange(event) {
    console.log("on change", event)
    this.setData({
      activeNames: event.detail,
    });
  },
  clickStep(s) {
    console.log('click step', s)


  },
  onClickRight() {
    let e = this.data.editStatus ? false : true
    this.setData({
      editStatus: e
    })
  }
})