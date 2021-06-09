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
 //计算相差时间
  fun(t1, t2) {
    let startTime = new Date(t1); // 开始时间
    let endTime = new Date(t2); // 结束时间

    return Math.floor((endTime - startTime) / 1000 / 60 / 60)
  },
  //打卡执行函数操作数据库
  async dkch() {
    let date = this.getCurrentDate(2)
    if (this.data.dk == "打卡") {

      db.collection('dk')
        .add({
          data:
          {
            xh: getApp().globalData.user.xh,
            start: date,
            end: '',
            timesc: '',
            createTime:db.serverDate() 
          }
        }).then(res => {
          console.log(res)
      db.collection('dk')
        .field({  
          start: true,
          end: true,  
          })
          .orderBy('start', 'desc')
          .get()

          db.collection('user').doc(getApp().globalData.user._id)
            .update({
              data: {
                dkid: res._id
              }
            }).then(data => {

              this.getUser()
              wx.showToast({
                title: '打卡成功',
              })

              this.getdklist()
            })

        })

    } else {
      
      const dk = await db.collection('dk')
      .where({
        _id:getApp().globalData.user.dkid
      }).get()
      
      console.log("dk",dk)
      db.collection('dk').doc(getApp().globalData.user.dkid)
      .update({
        data: {
          end: date,
          timesc:this.fun(dk.data[0].start,date)
        }
      }).then(data => {
        db.collection('user').doc(getApp().globalData.user._id)
        .update({
          data: {
            dkid: ""
          }
        }).then(data => {

          this.getUser()
          wx.showToast({
            title: '退卡成功',
          })

          this.getdklist()
        })
      
      })
      


    }

  },
  // 获取用户信息
  async getUser(){
    const data = await db.collection('user')
    .where({
      xh: getApp().globalData.user.xh,
      pwd:getApp().globalData.user.pwd
    }).get()

    getApp().globalData.user = data.data[0]
    if(getApp().globalData.user.dkid){
      this.setData({
        dk:"退卡"
      })
    }else{
      this.setData({
        dk:"打卡"
      })
    }
    
  },
  // 获取事件函数，传参数1获取日期，传2获取日期事件
  getCurrentDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
      time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
      time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
  }
})
