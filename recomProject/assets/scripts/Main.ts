import init from "./myApi/gameDataInit";
import GameBoxTool from "./GameBox/GameBoxTool";
import GameData from "./GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.Prefab, tooltip: "九宫格预制体" })
    popularUIPrefab: cc.Prefab = null;

    @property({ type: cc.Prefab, tooltip: "误触界面预制体" })
    crazyClickPanel: cc.Prefab = null;

    @property([cc.Node])
    recomNode: cc.Node[] = [];

    onLoad() {
        this.recomNode.forEach((node) => {
            node.active = false;
        })
    }

    start() {
        init().then(() => {
            GameData.isBalck = false;
            this.recomNode.forEach((node) => {
                node.active = true;
            })
        })
    }

    onOpenMoreGame() {
        cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showMoreGameUI);
    }
    onOpenFakeUI() {
        cc.systemEvent.emit(GameBoxTool.GameBoxEvent.showFakeGameUI);
    }
    onPopularUI() {
        let popularUI = cc.instantiate(this.popularUIPrefab);
        popularUI.parent = this.node;
    }
}
