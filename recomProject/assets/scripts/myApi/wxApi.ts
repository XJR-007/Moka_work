
import { isWechat } from "./system";




const wx = window["wx"];
export default class wxApi {

  static _instance: wxApi

  static get instance(): wxApi {
    if (null == this._instance) {
      this._instance = new wxApi()
    }
    return this._instance
  }
  currentTime = 0
  time = 0
  transpond() {
    // var imageUrl = "https://mmocgame.qpic.cn/wechatgame/VibtUPqN9NrvUK4RA2jbjdH9jgyJ2SrIBY3LNgk6U2Hm6kMWwM6JIZbkEiaeZrY2eh/0"
    window["wx"].showShareMenu()
    window["wx"].onShareAppMessage(() => {
      return {
        title: "你已被敌方导弹锁定，速度“开炮”予以反击！",
        imageUrl: "https://mmocgame.qpic.cn/wechatgame/VibtUPqN9NrvUK4RA2jbjdH9jgyJ2SrIBY3LNgk6U2Hm6kMWwM6JIZbkEiaeZrY2eh/0",
        // query: "openid=" + MCore.user_openid,
      }
    })
    window["wx"].updateShareMenu({
      withShareTicket: true
    })
  }
  shareNorm() {
    return new Promise((resolve, reject) => {
      console.log("分享")
      window["wx"].shareAppMessage({
        title: "你已被敌方导弹锁定，速度“开炮”予以反击！",
        imageUrl: "https://mmocgame.qpic.cn/wechatgame/VibtUPqN9NrvUK4RA2jbjdH9jgyJ2SrIBY3LNgk6U2Hm6kMWwM6JIZbkEiaeZrY2eh/0",
        // query: "openid=" + MCore.user_openid,
      })
      window["wx"].onShow(() => {
        var date = new Date();
        var curtime = date.getTime();
        var time = (curtime - this.currentTime) / 1000;
        console.log("当前时间差为", time);
        if (time >= 2) {
          console.log("分享成功")
          resolve(true)
        } else {
          console.log("分享失败")
          resolve(false)
        }
      })
      window["wx"].onHide(() => {
        var date = new Date();
        this.currentTime = date.getTime();
      })
    })
  }


  public static createBanner(adUnitId) {
    if (!isWechat) return

    let banner = window["wx"].createBannerAd({
      adUnitId,
      style: {
        left: 50,
        top: 100,
        width: 300,
      },
    })

    // banner.onResize((res) => {
    //   const { windowHeight, windowWidth } = wx.getSystemInfoSync()
    //   banner.style.top = windowHeight - res.height - 15
    //   banner.style.left = (windowWidth - res.width) / 2
    //   // banner.style.top = windowHeight - res.height;
    //   // banner.style.left = 0
    // })

    banner.show((res) => {
      console.log('onshow', res)
    })

    banner.onError((err) => {
      console.log('error', err)
    })

    return banner
  }

  public static openRewardVideo(adUnitId: string) {
    if (isWechat) {

      return new Promise((resolve, reject) => {
        const videoAd = window["wx"].createRewardedVideoAd({
          adUnitId,
        })

        videoAd.onError((e) => {
          console.log('video load error', e)
          this.showToast('今日的视频播放次数用完了')

        })

        videoAd.onClose((res) => {
          videoAd.offClose()

          // if (res && res.isEnded) {
          //   // sign.create({ type: VIDEO }).then((data) => {
          //   //   api.setPeopleReward(data)
          //   // })
          //   // 用户uuid_流量类别_流量来源标识_完成观看标识位
          //   ald.sendEvent('视频观看',{'结果':MCore.user_openid+'@'+MCore.is_from+'@1'});
          //   resolve(true)
          // } else {
          //   wxUtils.showToast('视频未播放完毕')
          //   ald.sendEvent('视频观看',{'结果':MCore.user_openid+'@'+MCore.is_from+'@0'});
          //   resolve(false)
          // }
        })

        videoAd
          .load()
          .then(() => {
            videoAd.show()
          })
          .catch((err) => {
            reject(err.errMsg)
          })
      })
    }
  }

  public static login(): Promise<{ code: string }> {
    return new Promise((resolve, reject) => {
      console.log("window wx login")
      window["wx"].login({
        success: resolve,
        fail: reject,
      })
    })
  }
  public exitProgrom() {
    window["wx"].exitMiniProgram()
  }

  public static getStorage(key: string) {

    return window["wx"].getStorageSync(key)
  }

  public static setStorage(key: string, value: any) {
    return window["wx"].setStorageSync(key, value)
  }

  public static onHide(func) {
    if (isWechat) {
      window["wx"].onHide(() => {
        // analytics.sendEvent('log_wx onHide')
        func()
      })
    }
  }

  public static showToast(key: string) {
    if (!isWechat) return
    return window["wx"].showToast({
      title: key,
      icon: 'none'
    })
  }

  public static getLaunchOptionsSync() {
    if (window["wx"]) {
      let info = window["wx"].getLaunchOptionsSync();
      console.log("获取系统登录信息", info);
      return info;
    } else {
      return {
        query: {
          shareToken: 'shareToken',
          action: 'action',
        },
        referrerInfo:{
          
        }
      }
    }
  }

  public static setting(n: cc.Node) {
    if (window['wx']) {
      let winSize = window["wx"].getSystemInfoSync();
      if (winSize.screenWidth / winSize.screenHeight < 0.5) {
        n.y += 100
      }
    }
  }

  public static showVideo(adUnitId: string, callBack?: () => void) {
    if (!window['wx']) return
    return new Promise((resolve, reject) => {
      const videoAd = wx.createRewardedVideoAd({ adUnitId })

      videoAd.onError(e => {
        //toastManager.toastShow('暂无视频')

        reject(false)
      })

      videoAd.onClose(res => {
        videoAd.offClose()

        if (res.isEnded) {
          resolve(true)
        }
        else {
          //toastManager.toastShow('视频未播放完毕！')
          resolve(false)
        }
      })

      videoAd.load().then(() => {
        videoAd.show()
      }).catch((err) => {
        reject(err.errMsg)
      })

    })
  }



  // update (dt) {}
}
