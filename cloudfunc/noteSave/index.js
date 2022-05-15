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
  let rs 
  console.log("note save", event, context)
  let isData = await db.collection('note').where({
    openid: wxContext.OPENID,
    date: event.date
  }).get({
    success: function(res) {
      console.log(res.data)
    }
  })
  console.log("is data", isData)
  if(isData.data.length > 0){
    rs = await db.collection('note').where({
      date: event.date,
      openid: wxContext.OPENID,
    }).update({
      data: {
        doc: event.doc
      },
      success: function(res) {
        console.log("update", res)
      }

    })

  } else {
    rs = await db.collection('note').add({
      data: {
        doc: event.doc, 
        openid: wxContext.OPENID,
        date: event.date
      },
      success: function(res){
        console.log("db res",res)
      }
    })

  }

  return {
    event,
    rs: rs
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}