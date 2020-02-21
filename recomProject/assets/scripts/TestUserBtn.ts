import wxApi from "./myApi/wxApi"
import api from "./myApi/api";

const { ccclass, property } = cc._decorator;

enum BtnType {
    None = 0,
    CeshiWhite = 1,//进入测试白名单
    ClearData = 2,//清除数据
}

@ccclass
export default class TestUserBtn extends cc.Component {

    @property({ type: cc.Enum(BtnType), tooltip: "按钮类型" })
    btnType: BtnType = BtnType.None;

    touchNum: number = 0;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.touchNum += 1;
            this.tempDt = 0;
            if (this.touchNum >= 20) {
                this.touchNum = 0;
                switch (this.btnType) {
                    case BtnType.None: {
                        break;
                    }
                    case BtnType.CeshiWhite: {
                        window["wx"] && window["wx"].setStorageSync("white_test_check", 1);
                        wxApi.showToast("进入测试白名单！");
                        break;
                    }
                    case BtnType.ClearData: {
                        api.reset();
                        wxApi.showToast("清除服务器数据！");
                        break;
                    }
                }
            }
        }, this)
    }

    private tempDt: number = 0;
    update(dt: number) {
        if (this.touchNum) {
            this.tempDt += dt;
            if (this.tempDt > 5) {
                this.tempDt = 0;
                this.touchNum = 0;
            }
        }
    }
}
