// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'timetable-81f1c'
})
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  return await db.collection('events')
  .aggregate().lookup({
    from: 'courses',
    localField: 'course_id',
    foreignField: '_id',
    as: 'courseName',
  })
  .match(db.command.or([
    {
      course_classId: event.classId,
      pre_id: db.command.exists(false)
    },
    {
      _openid: event.openid,
      course_classId: event.classId,
      pre_id: db.command.exists(true)
    }
  ])
  )
  .sort({endDate: 1})
  .end()
}