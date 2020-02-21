import bannerManager from "../myApi/bannerManager";
import ald from "../myApi/ald";

const { ccclass, property } = cc._decorator;
@ccclass
export default class CrazyClickPanel extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    bloodNumber = 350
    isFinish = false;

    finishTime = 200

    onHideGame: Function = null;

    onEnable() {
        this.bloodNumber = 350;
        this.isFinish = false;
        this.progressBar.progress = this.bloodNumber / 350;
        this.finishTime = this.randomNumber(150, 250);

        bannerManager.commonHide();

        ald.sendEvent("banner_连点曝光");
    }
    onDisable() {
        bannerManager.clickHide();
        bannerManager.clickRemove();
    }

    update(dt: number) {
        if (!this.isFinish) {
            if (this.bloodNumber < 350) {
                if (this.bloodNumber <= this.finishTime) {
                    console.log("结束疯狂点击");
                    this.isFinish = !0;

                    let hadHideGame = false;
                    this.scheduleOnce(function () {
                        if (hadHideGame) {
                            ald.sendEvent("banner_领取成功(误触)");
                        } else {
                            ald.sendEvent("banner_领取成功");
                        }
                        //TODO:打开误触的奖励页面，并且关掉该页面
                    }, 1);

                    bannerManager.clickShow();
                    if (window["wx"]) {
                        window["wx"].offHide(this.onHideGame);
                        this.onHideGame = () => {
                            hadHideGame = true;
                            ald.sendEvent("banner_点击到广告");
                            window["wx"].offHide(this.onHideGame);
                        };
                        window["wx"].onHide(this.onHideGame);
                    }
                    this.bloodNumber = 0;
                } else {
                    this.bloodNumber += 5;
                }
                this.progressBar.progress = this.bloodNumber / 350;
            }
        }
    }

    onTouchButton() {
        this.bloodNumber -= this.randomNumber(70, 150)
        this.progressBar.progress = this.bloodNumber / 350;
    }

    randomNumber(a, b) {
        return Math.floor(Math.random() * (b - a) + 1) + a;
    }
}