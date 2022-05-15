// pages/component/pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2022-03-12",
    editStatus: false,
    sms: 123,
    // readonly: true,
    active: 0,
    steps: [],
    cp: [
      {name: '大盘预判', msg: ''},
      {name: '今日开盘', msg: ''},
      {name: '盘中记录', msg: ''},
      {name: '午盘总结', msg: ''},
      {name: '尾盘记录', msg: ''},
      {name: '操盘总结', msg: ''},
    ],
    activeNames: [],
    market: {
      amount: '-',
      chg: 0,
      current: '-',
      date: '',
      last_close: '-',
      open: '-',
      percent: '-',
      status: '',
    },
    color: 'blank',
    setInter: ''
    
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
    this.setData({steps: steps, date: options.date})
    // 根据date获取操盘信息
    wx.cloud.callFunction({
      name: 'noteSearch',
      data: { date: options.date },
      complete: res => {
        let rs = res.result.data
        console.log("res search:", res.result.data);
        let cp = this.data.cp
        let n = 0
        // 查看操盘状态msg是否为0， 为0则不打开折叠面板
        let actives = []
        if(Object.keys(rs).length>0) {
          cp.map(v=>{
            v.msg = rs.doc[n.toString()]
            if (v.msg.length>0){
              actives.push(n)
            }
            n += 1
          })
        }
        console.log("cp:", cp)
        this.setData({cp: cp, activeNames: actives})
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err);
      }
    })
    this.getMakretCloud(options.date)
    // 定时更新行情
    let that = this
    let interval = setInterval(() => {
      // 判断时间范围查询数据库
      that.getMakretCloud(options.date)
    }, 15000);
    this.setData({setInter: interval})
  },

  getMakretCloud(date) {
    // 根据date获取行情信息
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getMarket',
      // 传给云函数的参数
      data: {
        date: date,
      },
    })
    .then(res => {
      let d = res.result.rs.data
      if (d.length>0) {
        let sh = d[0].sh
        let sz = d[0].sz
        let amount = (sh.amount + sz.amount)/ 10000 / 10000
        sh.amount = amount.toFixed(2)
        let color = sh.chg === 0 ? 'black' : sh.chg > 0 ? 'crimson' : 'rgb(53 189 75)'
        this.setData({market: sh, color: color})
        console.log("get market", d, sh)
      }
    })    
    .catch(console.error)
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
    let that = this
    clearInterval(that.data.setInter)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    clearInterval(that.data.setInter)
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
  submit(e) {
    console.log('submit', e, e.detail.value)
    let state = this.data.editStatus
    if (state) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      
      this.noteSaveYun(e.detail.value)
    } else {
        this.setData({
          editStatus: true
        })
    }
  },
  noteSaveYun(doc) {
    wx.cloud.callFunction({
      name: 'noteSave',
      data: { "doc": doc, "date": this.data.date },
      complete: res => {
        console.log("res:", res.result);
        // 改变按钮状态
        let s = this.data.editStatus ? false : true
        this.setData({
          editStatus: s
        })
        setTimeout(()=>{
          wx.hideLoading()
        }, 0)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err);
      }
    })
  }

})