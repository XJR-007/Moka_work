import GameBoxTool from "./GameBoxTool";
import GameItem from "./GameItem";
import GameData from "../GameData";
import ald from "../myApi/ald";
import bannerManager from "../myApi/bannerManager";


const { ccclass, property } = cc._decorator;

/** 假退出页面 */
@ccclass
export default class FakeExiteUI extends cc.Component {

    @property(cc.Prefab)
    fakeUIItemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Button)
    backBtn: cc.Button = null;

    start() {
        this.backBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.node.active = false;

            if (window["hideAdInClose"] !== true) {
                bannerManager.commonShow();
            }
        });
    }

    onEnable() {
        //隐藏banner广告
        bannerManager.commonHide();
        this.createGameList();
    }

    createGameList() {
        let gameDatas = [...GameData.gameDatas];

        GameBoxTool.shuffle(gameDatas);

        //console.log(gameDatas);
        this.scrollView.content.removeAllChildren();
        for (let i = 0; i < gameDatas.length; i++) {
            let gameData = gameDatas[i];
            let node = cc.instantiate(this.fakeUIItemPrefab);
            let gameItem = node.getComponent(GameItem);
            this.scrollView.content.addChild(gameItem.node);
            let name = gameData.name;
            ald.sendEvent("recom_假最近曝光", { 'game': name })
            gameItem.init(gameData);

            gameItem.success = () => {
                console.log("跳转游戏成功", name);
                ald.sendEvent('recom_总导流', { 'game': name });
                ald.sendEvent("recom_假最近导流", { 'game': name })
                //TODO:
            }
            gameItem.fail = () => {
                console.log("跳转游戏失败", name);
                //打开聚合页
                //ald.sendEvent("最近使用互推游戏跳转失败", { 'game': name })
            }

            /* let name = gameData.name;
            WeChatCtrl.aldSdkSendEvent("recom_假最近使用曝光", { games: name });
            gameItem.success = () => {
                console.log("跳转游戏成功", name);
                //TODO:
                WeChatCtrl.aldSdkSendEvent("recom_总导流", { games: name });
                WeChatCtrl.aldSdkSendEvent("recom_假最近使用导流", { games: name });
            }
            gameItem.fail = () => {
                console.log("跳转游戏失败", name);
            } */
        }
    }
}
