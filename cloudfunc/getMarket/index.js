// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test2-5hlbd', 
  traceUser: true,
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // 查询选择当天的股票行情，如果选择的日期小于现在的日期昨收直接从数据里取last_close
  // 如果选择日期大于现在时间1天小于开盘时间，则昨收取current，其他数据为空
  let rs = await db.collection('market').where({
    date: event.date
  }).get({
    success: function(res) {
      console.log(res.data)
    }
  })

  return {
    rs,
    event,  
  }
}