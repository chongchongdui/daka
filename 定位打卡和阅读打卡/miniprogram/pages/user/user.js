// miniprogram/pages/user/user.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: 0,
    dktime: 0,
    xh: '',
    name: '',
    pwd: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    await this.getuser()
    console.log("appData", app.globalData.user)
    this.setData({
      name: app.globalData.user.username,
      xh: app.globalData.user.xh
    })
    await this.getbook()
    await this.getdk()
  },
  /**
   * 获取用户信息
   */
  async getuser() {
    const data = await db.collection('user')
      .where({
        xh: app.globalData.user.xh,
        pwd: app.globalData.user.pwd
      }).get()
      console.log("data",data)
    app.globalData.user = data.data[0]
  }
})
