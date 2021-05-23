// miniprogram/pages/yd/yd.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist:[],
    sname:'',
    userxh:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '阅读打卡'
    })
    this.setData({
      userxh:getApp().globalData.user.xh,
    })
    this.getydLIst()
  },
  addbook(){
    let date = this.getCurrentDate(2)
    db.collection('yd')
  .add({
    data: 
    {
      "bookname": this.data.sname,
      "hsdate": "",
      "jsdate": date,
      "xh": this.data.userxh
    }
    
  }).then(add=>{
    this.getydLIst()
    this.getydLIst()
      wx.showToast({
        title: '借书成功',
      })
  })

  },
  hscli(e){
    console.log(e.currentTarget.dataset.hsid)
    // e.currentTarget.dataset.hbid
    let date = this.getCurrentDate(2)
    db.collection('yd').doc(e.currentTarget.dataset.hsid)
    .update({
      data: {
        hsdate: date
      }
    }).then(data => {

     this.getydLIst()
      wx.showToast({
        title: '还书成功',
      })
    })
  },
  async getydLIst(){
    const ydli = await db.collection('yd')
    .where({
      xh: this.data.userxh
    })
    .get()
  
    this.setData({
      booklist:ydli.data
    })
  },
  onChange(e){
    this.setData({
      sname:e.detail
    })
  },
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