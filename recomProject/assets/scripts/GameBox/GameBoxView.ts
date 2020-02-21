import GameBoxTool from "./GameBoxTool";
import GameItem from "./GameItem";
import GameData from "../GameData";
import ald from "../myApi/ald";

const { ccclass, property } = cc._decorator;

/** 通用互推滚动脚本  */
@ccclass
export default class GameBoxView extends cc.Component {

    @property({ type: cc.Prefab, tooltip: "该互推组件中的单体，需要带有GameItem脚本" })
    gameItemPrefab: cc.Prefab = null;

    @property({ type: cc.ScrollView, tooltip: "互推滚动组件，该组件的content的锚点应设置为(0.5,0.5)" })
    scrollView: cc.ScrollView = null;

    @property({ tooltip: "是否为竖直滚动" })
    isVertical: boolean = true;

    @property()
    autoScrollSpeed: number = 50;

    @property({ tooltip: "阿拉丁打点的位置标签" })
    postionTag: string = "结算";

    @property([cc.SpriteFrame])
    nameBgs: cc.SpriteFrame[] = [];

    speedFlag: number = -1;

    viewSize: number = 0;

    contentSize: number = 0;

    private nameBgIndex = -1;

    onEnable() {
        this.init();
    }

    init() {
        let gameDatas = [...GameData.gameDatas];

        GameBoxTool.shuffle(gameDatas);

        this.scrollView.content.removeAllChildren();

        for (let i = 0; i < gameDatas.length * 2; i++) {
            let index = i % gameDatas.length;
            let iconIndex = 0;
            if (i >= gameDatas.length) {
                iconIndex = 1;
            }
            let name = gameDatas[index].name;
            ald.sendEvent(`recom_${this.postionTag}曝光`, { 'game': name });

            let item = cc.instantiate(this.gameItemPrefab);
            item.parent = this.scrollView.content;
            let gameItem = item.getComponent(GameItem);
            gameItem.init(gameDatas[index], iconIndex);

            gameItem.success = () => {
                console.log("跳转游戏成功", name);
                ald.sendEvent('recom_总导流', { 'game': name });
                ald.sendEvent(`recom_${this.postionTag}导流`, { 'game': name });
            }
            gameItem.fail = () => {
                console.log("跳转游戏失败", name);
                //ald.sendEvent("结算页互推游戏跳转失败", { 'game': name });
                //打开聚合页
                cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showMoreGameUI);
            }

            if (this.nameBgs.length) {
                gameItem.node.getChildByName("nameBg").getComponent(cc.Sprite).spriteFrame = this.nameBgs[this.getNameBgIndex()];
            }
        }
        this.scrollView.content.getComponent(cc.Layout).updateLayout();
        this.contentSize = this.isVertical ? this.scrollView.content.height : this.scrollView.content.width;
        this.viewSize = this.isVertical ? this.scrollView.node.height : this.scrollView.node.width;

        this.scrollView.scrollToTop(0);
    }

    update(dt: number) {
        this.moveChildreNode(dt);
    }

    moveChildreNode(dt: number) {
        if (this.contentSize <= this.viewSize) return;
        let changeKey = this.isVertical ? "y" : "x";
        this.scrollView.content[changeKey] += dt * this.speedFlag * this.autoScrollSpeed;
        let max = (this.contentSize - this.viewSize) / 2;
        if (this.scrollView.content[changeKey] >= max) {
            this.speedFlag = -1;
        }
        if (this.scrollView.content[changeKey] <= -max) {
            this.speedFlag = 1;
        }
    }

    getNameBgIndex() {
        this.nameBgIndex++
        if (this.nameBgIndex >= this.nameBgs.length) {
            this.nameBgIndex = 0;
        }
        return this.nameBgIndex
    }
}
