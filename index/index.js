// miniprogram/pages/index/index.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xh:'',
    mm:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 登录函数
 async  login(){
    console.log(this.data.xh)
    const data = await db.collection('user')
    .where({
      xh: this.data.xh,
      pwd:this.data.pwd
    }).get()
    if(data.data.length>0){
      wx.showToast({
        title: '登录成功',
      })
      // 登录成功在全局中存储登录信息，并跳转页面
      console.log(data)
      app.globalData.user = data.data[0]
      wx.switchTab({
        url: '/pages/main/main',
      })
    }else{
      wx.showToast({
        title: '找不到该用户',
        icon:'none'
      })
    }

  },
  // 双向绑定组
  // start
  xhChange(e){
      this.setData({
        xh:e.detail
      })
  },
  pwdChange(e){
    this.setData({
      pwd:e.detail
    })
  }
  // end
  
})