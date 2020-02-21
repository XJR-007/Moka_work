import GameBoxTool from "./GameBoxTool";
import GameItem from "./GameItem";
import GameData from "../GameData";
import ald from "../myApi/ald";
import bannerManager from "../myApi/bannerManager";

const { ccclass, property } = cc._decorator;

/** 复合页 */
@ccclass
export default class MoreGameUI extends cc.Component {

    @property(cc.Node)
    mainNode: cc.Node = null;

    @property(cc.Node)
    fakeExtiteUINode: cc.Node = null;

    @property(cc.Prefab)
    gameItem1Prefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Button)
    continueBtn: cc.Button = null;

    @property([cc.SpriteFrame])
    nameBgs: cc.SpriteFrame[] = [];

    hadInit: boolean = false;

    dataArr = [];

    private speed: number = 150;
    private contentHeight = 0;
    private viewHeight = 0;

    private nameBgIndex: number = -1;

    autoScrollDelay: number = 0;

    onLoad() {
        cc.systemEvent.on(GameBoxTool.GameBoxEvent.showMoreGameUI, () => {
            console.log("显示聚合页");
            this.show();
            /* if (!GameData.isBalck) {
                this.show();
            } */
        });

        cc.systemEvent.on(GameBoxTool.GameBoxEvent.showFakeGameUI, () => {
            if (!GameData.isBalck) {
                this.fakeExtiteUINode && (this.fakeExtiteUINode.active = true);
            }
        });

        this.continueBtn.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.hide();
            try {
                window['closeGameBoxCallback'] && window['closeGameBoxCallback']()
                window['closeGameBoxCallback'] = null
            } catch (e) { }
        });

        //this.hide();
    }

    start() {
        this.viewHeight = this.content.parent.height;
    }

    init() {
        if (this.hadInit) {
            return;
        }
        this.hadInit = true;

        this.dataArr = [...GameData.gameDatas];
        GameBoxTool.shuffle(this.dataArr);
        console.log(this.dataArr, GameData.gameDatas);

        this.initList();
    }

    initList() {
        this.content.removeAllChildren();
        for (let i = 0; i < this.dataArr.length * 2; i++) {
            let index = i % this.dataArr.length;
            let iconIndex = 0;
            if (i >= this.dataArr.length) {
                iconIndex = 1;
            }
            let name = this.dataArr[index].name;
            ald.sendEvent("recom_聚合曝光", { 'game': name })
            let item = cc.instantiate(this.gameItem1Prefab);
            item.parent = this.content;
            let gameItem = item.getComponent(GameItem);
            gameItem.init(this.dataArr[index], iconIndex);
            gameItem.success = () => {
                console.log("跳转游戏成功", name);
                ald.sendEvent('recom_总导流', { 'game': name });
                ald.sendEvent("recom_聚合导流", { 'game': name })
                //TODO:
            }
            gameItem.fail = () => {
                console.log("跳转游戏失败", name);
                //ald.sendEvent("聚合页互推游戏跳转失败", { 'game': name })
            }
            if (this.nameBgs.length) {
                gameItem.node.getChildByName("nameBg").getComponent(cc.Sprite).spriteFrame = this.nameBgs[this.getNameBgIndex()];
            }
        }
        this.content.getComponent(cc.Layout).updateLayout();
        this.contentHeight = this.content.height;
        
        this.scrollView.scrollToTop(0);
    }

    moveChildreNode(dt: number) {


        if (this.contentHeight <= this.viewHeight) return;


        this.content.y += dt * this.speed;
        let max = (this.contentHeight - this.viewHeight) / 2;
        if (this.content.y >= max) {
            this.speed = -75
        }
        if (this.content.y <= -max) {
            this.speed = 75
        }
    }

    show() {
        console.log(this.node.active);
        this.mainNode.active = true;
        //隐藏banner广告
        bannerManager.commonHide();

        this.init();

        this.autoScrollDelay = 1;
    }

    hide(isOpenFakeUI: boolean = false) {
        this.mainNode.active = false;
        if (!isOpenFakeUI) {
            //显示banner广告
            bannerManager.commonShow();
        }
    }

    update(dt: number) {
        if (!this.mainNode.active) return;

        if (this.autoScrollDelay > 0) {
            this.autoScrollDelay -= dt;
        } else {
            this.moveChildreNode(dt);
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
