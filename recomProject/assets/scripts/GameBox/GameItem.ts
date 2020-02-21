import GameBoxTool from "./GameBoxTool";
import ald from "../myApi/ald";


const { ccclass, property } = cc._decorator;

/** 互推单体脚本 */
@ccclass
export default class GameItem extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    nameText: cc.Label = null;//可以不用

    success: Function = null;

    fail: Function = null;

    init({ name, path, icon, appId }, iconIndex = 0, loaded?: Function) {

        if (this.nameText) {
            this.nameText.string = name;
        }

        ald.sendEvent("recom_总曝光", { 'game': name })
        this.success = () => {
            console.log("跳转游戏成功", name);
            ald.sendEvent('recom_总导流', { 'game': name });
            //TODO:
        }
        this.fail = () => {
            console.log("跳转游戏失败", name);
            //打开聚合页
            cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showMoreGameUI);
        }

        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            console.log("点击跳转", name);
            GameBoxTool.navigate({ appId, path }, this.success, this.fail);
        });

        try {
            let iconUrl = typeof icon === "string" ? icon : icon[iconIndex];
            GameBoxTool.loadIcon(iconUrl).then((res) => {
                const tex: cc.Texture2D = res as cc.Texture2D;
                this.icon.spriteFrame = new cc.SpriteFrame(tex);

                loaded && loaded();
            });
        } catch (error) {
            console.log("加载互推游戏图片失败！", error);
        }
    }

    playTipAnimation() {
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.rotateBy(.1, 10), cc.rotateBy(.2, -20), cc.rotateBy(.1, 10), cc.rotateBy(.1, 10), cc.rotateBy(.2, -20), cc.rotateBy(.1, 10), cc.rotateBy(.1, 10), cc.rotateBy(.2, -20), cc.rotateBy(.1, 10), cc.delayTime(3)).repeatForever());
    }
}
