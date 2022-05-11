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
  // 查询选择当天的股票行情
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