
import GameItem from "./GameItem";
import GameBoxTool from "./GameBoxTool";
import GameData from "../GameData";
import ald from "../myApi/ald";

const { ccclass, property } = cc._decorator;

/** 底部游戏推荐 */
@ccclass
export default class GameSuggest extends cc.Component {

    @property(cc.Prefab)
    suggestItemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    speed: number = -50;

    hadInit: boolean = false;

    viewWidth: number = 0;

    contentWidth: number = 0;

    start() {
        this.viewWidth = this.scrollView.node.width;
    }

    onEnable() {
        this.init();
    }

    init() {
        let gameDatas = [...GameData.gameDatas];

        GameBoxTool.shuffle(gameDatas);

        this.content.removeAllChildren();
        for (let i = 0; i < gameDatas.length; i++) {
            let name = gameDatas[i].name;
            let item = cc.instantiate(this.suggestItemPrefab);
            item.parent = this.content;
            let gameItem = item.getComponent(GameItem);

            ald.sendEvent('recom_横幅曝光', { 'game': name });
            gameItem.init(gameDatas[i]);
            gameItem.success = () => {
                console.log("跳转游戏成功", name);
                ald.sendEvent('recom_总导流', { 'game': name });
                ald.sendEvent("recom_横幅导流", { 'game': name });
            }
            gameItem.fail = () => {
                console.log("跳转游戏失败", name);
                //打开聚合页
                cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showMoreGameUI);
            }
        }
        this.content.getComponent(cc.Layout).updateLayout();
        this.contentWidth = this.content.width;
    }

    update(dt: number) {
        this.moveChildreNode(dt);
    }

    moveChildreNode(dt: number) {
        if (this.contentWidth <= this.viewWidth) return;


        this.content.x += dt * this.speed;
        let max = (this.contentWidth - this.viewWidth) / 2;
        if (this.content.x >= max) {
            this.speed = -50
        }
        if (this.content.x <= -max) {
            this.speed = 50
        }
    }
}
