import ald from "./ald";
import GameData from "../GameData";


const { ccclass, property } = cc._decorator;

@ccclass
class VideoOrShareManager {

    //*************视频控制 */
    adUnitId = "adunit-bbd4101357499131";
    videoAd = null;
    hadError: boolean = false;
    isVideoReady: boolean = false;
    CallBackVideo: Function = null;
    //*************分享控制 */
    shareTitles: string[] = ["一枪命中!"];
    shareUrl: string[] = [];

    constructor() {
        if (this.adUnitId.length > 0) {
            this.createVideo();
        }
    }

    getConfig({ videoId, shareTitles, shareUrl }) {
        videoId && (this.adUnitId = videoId);
        shareTitles && (this.shareTitles = shareTitles);
        shareUrl && (this.shareUrl = shareUrl);
        if (this.adUnitId.length > 0) {
            this.createVideo();
        }
    }

    showShareMenu() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.showShareMenu({
                withShareTicket: true
            });
            wx.onShareAppMessage(() => {
                return {
                    title: this.shareTitles[0],
                    //imageUrl: WeChatCtrl.ShareUrl,
                };
            })
        }
    }


    createVideo() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (this.videoAd) {
                this.videoAd.destroy();
                this.videoAd = null;
            }
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: this.adUnitId
            });
            this.videoAd.onLoad(this._onVideoLoaded);
            this.videoAd.onError(this._onVideoError);
            this.videoAd.onClose(this._onVideoClose);
            this.loadVideo();
        }
    }

    loadVideo() {
        //WeChatManager.default.aldSdkSendEvent("video_广告拉取", null);
        console.log("--------广告拉取--------", this.adUnitId, this.videoAd);
        this.isVideoReady = false
        this.videoAd && this.videoAd.load()
    }

    showVideo(CallBackVideo?: Function) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!this.isVideoReady) {
                wx.showToast({
                    title: "暂无视频可观看",
                    icon: 'none'
                });
                this.loadVideo();
            }
            this.CallBackVideo = CallBackVideo;

            cc.director.pause();

            try {
                this.videoAd && this.videoAd.show().catch(function (error) {
                    cc.director.resume()
                    console.log("播放视频错误:", JSON.stringify(error))
                });
            } catch (error) {
                cc.director.resume()
                console.log("播放视频错误:", JSON.stringify(error))
            }
        } else {
            CallBackVideo && CallBackVideo(true);
        }
    }

    shareApp(callFunc?: Function) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.shareAppMessage({
                title: this.shareTitles[0],
                //imageUrl:
            });
            let oldTime = new Date().getTime();
            let onShow = () => {
                let nowTime = new Date().getTime();
                let subTime = nowTime - oldTime;
                console.log("share onShow", subTime, oldTime, nowTime);
                if (subTime > 3000 && subTime < 15000) {
                    callFunc && callFunc(true);
                } else {
                    callFunc && callFunc(false);
                }
                wx.offShow(onShow);
            }
            wx.onShow(onShow);
        } else {
            callFunc && callFunc(true);
        }
    }

    checkVideo() {
        console.log("checkVideo", this.hadError, this.isVideoReady)
        if (this.hadError === true || this.isVideoReady === false) return false;
        return true;
    }

    _onVideoError = (error) => {
        console.log("-----视频广告加载失败--------", JSON.stringify(error))
        this.isVideoReady = false;
        this.hadError = true;
    }

    _onVideoLoaded = () => {
        this.isVideoReady = true;
        console.log("-----视频广告加载成功--------", this.isVideoReady, this.adUnitId, this.videoAd);
        ald.sendEvent("video_广告拉取");
    }

    _onVideoClose = (res) => {
        console.log("-----视频广告播放完毕-----")
        if (GameData.isNew) {
            ald.sendEvent("video_新用户播放完成");
        } else {
            ald.sendEvent("video_播放完成");
        }

        cc.director.resume();
        if (res) {
            if (this.CallBackVideo) {
                this.CallBackVideo(res.isEnded);
            }
        }
        this.loadVideo();
    }
}
export default new VideoOrShareManager();
