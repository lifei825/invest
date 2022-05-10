// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test2-5hlbd', 
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('eventaaaaa', event, context)
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    text: wxContext,
  }
}