// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test2-5hlbd', 
  traceUser: true,
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let data = {}
  let rs = await db.collection('note').where({
    openid: wxContext.OPENID,
    date: event.date
  }).get({
    success: function(res) {
      console.log(res.data)
    }
  })
  console.log("rs", rs, context)
  if(rs.data.length > 0){
    data = rs.data[0]
  }

  return {
    event,
    data
  }
}