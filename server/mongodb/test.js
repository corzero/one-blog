const UserModel = require('./Schema/user')
// const albumModel = require('./Schema/album')
// const authorModel = require('./Schema/author')
// const songModel = require('./Schema/song')

async function test(obj) {
  // const user = new UserModel()
  // user.save().then(res => {
  //   console.log('asdasdasdsd', res)
  // })
  const res = await UserModel.findOneAndUpdate({ sex: true }, { age: 100 })
  console.log(res)
}
const obj = {
  username: 'test_user',
  password: '1234567',
  sex: true,
  age: 18,
  email: '123@123.com',
  title: '有些人25岁就死了，直到70岁才埋入土里。'
}
test(obj)
