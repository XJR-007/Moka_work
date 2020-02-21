

export default class GameBoxTool {

    /** 系统信息 */
    private static SystemInfo: any = null;


    /** 打乱数组顺序 */
    static shuffle(arr: Array<any>) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var index = Math.floor(Math.random() * (len - i));
            var temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
    }

    /** 加载图片 */
    static loadIcon(url: string) {
        return new Promise((resovle, reject) => {
            cc.loader.load(url, (err, res) => {
                err ? reject(err) : resovle(res)
            })
        })
    }

    static GameBoxEvent = {
        showMoreGameUI: "showMoreGameUI",
        showFakeGameUI: "showFakeGameUI",
    }

    static getSystemInfo() {
        return new Promise((resolve, reject) => {
            if (this.SystemInfo == null) {
                if (window["wx"]) {
                    window["wx"].getSystemInfo({
                        success: (res) => {
                            this.SystemInfo = res;
                            resolve(res);
                        },
                        fail: reject,
                    });
                }
            } else {
                resolve(this.SystemInfo);
            }
        })
    }

    /**
     * 自定义事件      例如  wx.aldSendEvent("玩家角色死亡",{"关卡" : "56关","耗时" : startTime -  Date.now()})
     * @param eventName 事件名称
     * @param data {key:value,key:value,....}
     */
    public static aldSdkSendEvent(eventName, data) {
        console.log("阿拉丁打点", eventName, data);
        if (!window["wx"] || !window["wx"].aldSendEvent) return;
        if (data) window["wx"].aldSendEvent(eventName, data)
        else window["wx"].aldSendEvent(eventName)
    }

    static navigate(param: { appId: string, path: string }, success: Function, fail: Function) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            fail();
            return;
        }
        window["wx"].navigateToMiniProgram({
            appId: param.appId,
            path: param.path,
            success: success,
            fail: fail,
            complete: function () { }
        })
    }
}