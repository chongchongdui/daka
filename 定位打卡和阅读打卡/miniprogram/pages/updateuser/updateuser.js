// miniprogram/pages/updateuser/updateuser.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.setNavigationBarTitle({
      title: '个人信息修改'
    })
    this.getuserinfo()
  },
  //获取用户信息给页面变量赋值
  getuserinfo(){
    this.setData({
      user:app.globalData.user
    })
  },
  // 更新函数
  update(){
    db.collection('user').doc(app.globalData.user._id).update({
      data: {
        username: this.data.user.username,
        pwd: this.data.user.pwd
      }
    }).then(res=>{
      
      wx.showToast({
        title: '修改成功',
      })
    })
    
  },
  // 双向绑定组
  // start
  xm(e){
console.log(e)
this.data.user.username = e.detail.value
this.setData({
  user:this.data.user
})
  },
  pwd(e){
    this.data.user.pwd = e.detail.value
    this.setData({
      user:this.data.user
    })
  }
  //end
})