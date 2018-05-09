const app = getApp();

Page({
  data: {
    status: 'waiting',
    Upurl: 'https://febaug.cn/UpData',
    Downurl: 'https://febaug.cn/DownData',
    requesting: false,
    Line1: 'ヾ(◍•◡•◍)ﾉﾞ',
    Line2: '',
  },
  GetSysInfo() {
    wx.getSystemInfo({
      success: function (res) {
        var SysInfo = '';
        SysInfo += '品牌：';
        SysInfo += res.brand;
        SysInfo += '；';
        SysInfo += '型号：';
        SysInfo += res.model;
        SysInfo += '；';
        SysInfo += '微信版本号：';
        SysInfo += res.version;
        SysInfo += '；';
        SysInfo += '客户端平台：';
        SysInfo += res.platform;
        SysInfo += '；';
        SysInfo += '操作系统版本：';
        SysInfo += res.system;
        SysInfo += '；';
        console.log(SysInfo)
        wx.showModal({
          content: SysInfo,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      }
    })
  },
  //上传数据
  UpDataRequest() {
    this.setData({
      requesting: true,
      status: 'waiting',
      Line1: '--正在上传--',
      Line2: '',
    });
    var tmpJson = {};
    tmpJson.name = app.globalData.userInfo.nickName;
    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    var prevPage = pages[pages.length - 2]    //获取上一个页面
    tmpJson.list = prevPage.data.lists;
    if (tmpJson.list.length === 0) {
      this.setData({
        requesting: false,
        Line1: '｡◕ᴗ◕｡',
      });
      wx.showToast({
        title: '你有没有数据要上传，心里没点B数嘛！',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.request({
      url: this.data.Upurl,
      method: 'Get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: tmpJson,
      success: (res) => {
        if (+res.statusCode == 200) {
          this.setData({
            status: 'success',
            Line1: '服务器响应成功,：' + res.data,
            Line2: '同步时间：' + St,
          });
        }
        else {
          var St = new Date();
          this.setData({
            status: 'warn',
            Line1: 'warn！响应码：' + res.statusCode,
            Line2: '同步时间：' + St,
          });
        }
      },
      fail: (res) => {
        console.log(res);
        this.setData({
          status: 'warn',
          Line1: res.errMsg
        });
      },
      complete: () => {
        var St = new Date();
        this.setData({
          requesting: false,
          Line2: '同步时间：' + St,
        });
      }
    });
  },
  //下载数据
  DownDataRequest() {
    this.setData({
      requesting: true,
      status: 'waiting',
      Line1: '--正在下载--',
      Line2: '',
    });
    var tmpJson = {};
    tmpJson.name = app.globalData.userInfo.nickName;

    wx.request({
      url: this.data.Downurl,
      method: 'Get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: tmpJson,
      success: (res) => {
        if (+res.statusCode == 200) {
          if (res.data.name != '你之前有没有上传数据，心里没点B数嘛！') {
            var temp = [];
            var jsonlist = JSON.parse(res.data.list);
            for (var i in jsonlist) {
              var addT = {
                id: jsonlist[i].id,
                title: jsonlist[i].title,
                status: jsonlist[i].status
              }
              temp.push(addT);
            }

            var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
            var prevPage = pages[pages.length - 2]    //获取上一个页面
            prevPage.setData({
              lists: temp
            });
            prevPage.showCur(temp);
            wx.setStorage({
              key: "lists",
              data: temp
            });
            this.setData({
              status: 'success',
              Line1: '服务器响应成功,数据覆盖成功！' + res.data.name,
              Line2: '同步时间：' + St,
            });
          }
          else{
            this.setData({
              status: 'success',
              Line1: res.data.name,
              Line2: '同步时间：' + St,
            });
          }
        }
        else {
          var St = new Date();
          this.setData({
            status: 'warn',
            Line1: 'warn！响应码：' + res.statusCode,
            Line2: '同步时间：' + St,
          });
        }
      },
      fail: (res) => {
        console.log(res);
        this.setData({
          status: 'warn',
          Line1: res.errMsg
        });
      },
      complete: () => {
        var St = new Date();
        this.setData({
          requesting: false,
          Line2: '同步时间：' + St,
        });
      }
    });
  }
});