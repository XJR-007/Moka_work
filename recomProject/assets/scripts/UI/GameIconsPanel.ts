import GameItem from "../GameBox/GameItem";
import GameSuggest from "../GameBox/GameSuggest";
import GameData from "../GameData";
import GameBoxTool from "../GameBox/GameBoxTool";
import ald from "../myApi/ald";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ tooltip: "延时获取数据" })
    delayGetDatas: number = 0;

    @property({ type: [GameItem], tooltip: "卖量图标" })
    icons: GameItem[] = []

    @property({ type: GameSuggest, tooltip: "下部游戏推荐栏" })
    gameSuggest: GameSuggest = null;

    @property({ tooltip: "阿拉丁打点时的界面名" })
    panelName: string = "主页";

    datas: any[] = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        for (let i = 0; i < this.icons.length; i++) {
            this.icons[i].node.active = false;
        }
        this.gameSuggest && (this.gameSuggest.node.active = false);
    }

    update(dt: number) {
        if (this.delayGetDatas > 0) {
            this.delayGetDatas -= dt;
            return;
        }
        if (this.datas == null) {
            if (GameData.gameDatas.length > 0) {
                this.datas = [...GameData.gameDatas];
                this.init();
            }
        }
    }

    init() {
        GameBoxTool.shuffle(this.datas);

        let count = this.icons.length;
        let countDow = () => {
            count--;
            if (count == 0) {
                for (let i = 0; i < this.icons.length; i++) {
                    this.icons[i].node.active = true;
                    this.icons[i].playTipAnimation();
                }
            }
        }

        this.icons.forEach((icon, index) => {
            let name = this.datas[index].name;
            ald.sendEvent(`recom_${this.panelName}曝光`, { 'game': name });
            icon.init(this.datas[index], 0, countDow);

            icon.success = () => {
                console.log("跳转游戏成功", name);
                ald.sendEvent('recom_总导流', { 'game': name });
                ald.sendEvent(`recom_${this.panelName}导流`, { 'game': name });
                //TODO:
            }
            icon.fail = () => {
                console.log("跳转游戏失败", name);
                //打开聚合页
                cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showMoreGameUI);
            }
        });

        this.gameSuggest && (this.gameSuggest.node.active = true);
    }

}
