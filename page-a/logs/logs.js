//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    wx.setStorageSync('logs', [1,2,3])
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        console.log(log, 1111)
        return util.formatTime(new Date(log))
      })
    })
  }
})
