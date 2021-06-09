// miniprogram/pages/main/main.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    j: 0,
    w: 0,
    dk: '打卡',
    dklist:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function (options) {
    //修改头部标签
    wx.setNavigationBarTitle({
      title: '定位打卡'
    })
    let that = this
    //判断是否有打卡记录
if(getApp().globalData.user.dkid==''){
  this.setData({
    dk:"打卡"
  })
}else{
  this.setData({
    dk:"退卡"
  })
}
//获取打卡列表
await this.getdklist()
  // 获取当前经纬度的位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        that.setData({
          w: res.latitude,
          j: res.longitude
        })
      }
    })
  },
  /**
   * 获取打卡记录集合
   */
  async getdklist(){
    const dk = await db.collection('dk')
      .where({
        xh:getApp().globalData.user.xh
      }).get()
      console.log(dk)
      this.setData({
        dklist:dk.data
      })
  },
  /**
   * 打卡点击事件，获取当前地理位置，判断数据库中设定经纬度
   */
    async clickdk() {
    const data = await db.collection('wz').get()
    console.log(data)
    let mbj = data.data[0].j
    let mbw = data.data[0].w

    if (this.data.dk == "打卡") {
        // 获取判定范围经纬度  最大不超过0.1经纬度
      let dqj = mbj - this.data.j//
      let dqw = mbw - this.data.w//

      console.log("dqj", dqj)
      console.log("dqw", dqw)
      if (dqj > 0) {
        if (dqj < 0.01) {

          if (dqw > 0) {
            if (dqw < 0.01) {
              this.dkch()
              return
            }
          } else {
            if (dqw > -0.01) {
              this.dkch()
              return
            }
          }



        }
      } else {
        if (dqj > -0.01) {

          if (dqw > 0) {
            if (dqw < 0.01) {
              this.dkch()
              return
            }
          } else {
            if (dqw > -0.01) {
              this.dkch()
              return
            }
          }



        }
      }
      wx.showToast({
        title: '打卡失败，未在规定范围',
        icon: 'none'
      })
    } else {

      let dqj = mbj - this.data.j//mbj
      let dqw = mbw - this.data.w//mbw
      if (dqj > 0) {
        if (dqj < 0.01) {

          if (dqw > 0) {
            if (dqw < 0.01) {
              this.dkch()
              return
            }
          } else {
            if (dqw > -0.01) {
              this.dkch()
              return
            }
          }



        }
      } else {
        if (dqj > -0.01) {

          if (dqw > 0) {
            if (dqw < 0.01) {
              this.dkch()
              return
            }
          } else {
            if (dqw > -0.01) {
              this.dkch()
              return
            }
          }



        }
      }
      wx.showToast({
        title: '退卡失败，未在规定范围',
        icon: 'none'
      })

    }
  }
