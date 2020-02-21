import GameBoxTool from "./GameBoxTool";
import GameData from "../GameData";
import bannerManager from "../myApi/bannerManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class FakeExiteBtn extends cc.Component {

    @property({ tooltip: "关闭最近使用后是否隐藏广告" })
    hideAdInClose: boolean = false;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (this.hideAdInClose) {
                window["hideAdInClose"] = true;
            } else {
                window["hideAdInClose"] = false;
            }
            cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showFakeGameUI);
        });
        if (GameData.isBalck === false) {
            this.node.active = true;
        } else {
            this.node.active = false;
        }

        this.checkPos();
    }

    checkPos() {
        let winHeight = cc.winSize.height;
        GameBoxTool.getSystemInfo().then((sysInfo: any) => {
            let statusBarHeight = sysInfo.statusBarHeight;
            let screenHeight = sysInfo.screenHeight;
            let widget_y = (statusBarHeight) * winHeight / screenHeight;
            let posY = winHeight / 2 - widget_y;
            this.node.y = posY - 120;
        });
    }
}
