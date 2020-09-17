const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const db = wx.cloud.database()


const getDateData = function(year, month, v){
  var p = new Promise(function(resolve, reject){
    // 从云数据库获取选择月日历数据
    let k = `${year}-${month+1}-${v}`
    let data
    try{
      data = wx.getStorageSync(k)
      if(!data || typeof data === 'string'){
        throw "data为空"
      } else {
        resolve(data)
      }
    }catch(err){
      db.collection('calendar')
        .where({year: year, month: month+1})
        .field({
          day: true, 
          news: true,
          topInfo: true,
          bottomInfo: true,
          month: true,
          year: true,
        })
        .orderBy('day', 'asc').skip(0).limit(100)
        .get({
          success: function(res) {
            data = res.data
            console.log("get data from db", data)
            if(data.length>0){
              wx.setStorage({
                data: res.data,
                key: k
              })
            }
            resolve(data) 
          }
        })
    }
  })
  return p
}


module.exports = {
  formatTime: formatTime,
  getDateData: getDateData,
}
