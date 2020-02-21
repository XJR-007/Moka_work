
import GameBoxTool from "./GameBoxTool";
import GameData from "../GameData";

const { ccclass, property } = cc._decorator;

/** 随机推荐游戏按钮 */
@ccclass
export default class MoreGameBtn extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Sprite)
    bottom: cc.Sprite = null;

    @property([cc.SpriteFrame])
    bottomBgs: cc.SpriteFrame[] = [];

    @property(cc.Animation)
    anim: cc.Animation = null;

    currentGameData = {
        appId: "",
        path: "",
    };
    static count = 0;

    succese: Function = null;
    fail: Function = null;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => {
            let dePo = e.getDelta();
            this.node.position = this.node.position.add(dePo);
        });
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            GameBoxTool.navigate(this.currentGameData, this.succese, this.fail);
        });
    }

    start() {
        //this.anim = this.node.getComponent(cc.Animation);

        this.changeGame();
        this.playAni();
    }

    playAni() {
        if (this.anim) {
            this.anim.play().time;
            this.anim.on(cc.Animation.EventType.LASTFRAME, () => {
                this.changeGame();
            })
        }
    }

    changeGame() {

        const gameData = GameData.gameDatas[MoreGameBtn.count % GameData.gameDatas.length];
        this.bottom.spriteFrame = this.bottomBgs[MoreGameBtn.count % this.bottomBgs.length];
        MoreGameBtn.count++;
        const { icon, appId, path, name } = gameData;

        this.currentGameData = {
            appId,
            path
        }

        GameBoxTool.aldSdkSendEvent("recom_总曝光", { games: name });
        GameBoxTool.aldSdkSendEvent("recom_主页曝光", { games: name });
        this.succese = () => {
            console.log("跳转游戏成功", name);
            GameBoxTool.aldSdkSendEvent("recom_总导流", { games: name });
            GameBoxTool.aldSdkSendEvent("recom_主页导流", { games: name });
        }

        this.fail = () => {
            console.log("跳转游戏失败", name);
            //打开聚合页
            cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showMoreGameUI);
        }

        try {
            let iconUrl = typeof (icon) === "string" ? icon : icon[0];
            GameBoxTool.loadIcon(iconUrl).then((res) => {
                const tex: cc.Texture2D = res as cc.Texture2D;
                this.icon.spriteFrame = new cc.SpriteFrame(tex);
            });
            this.nameLabel.string = name;
        } catch (error) {
            console.log("加载图片失败", error);
        }
    }
}
