import HeartbeatSchedule from "./myApi/heartbeatSchedule";
import ald from "./myApi/ald";
import bannerManager from "./myApi/bannerManager";
import VideoOrShareManager from "./myApi/VideoOrShareManager";

type GameDataItem = {
    position: number
    name: string
    path: string
    icon: string | string[]
    appId: string
}

class GameData {

    scene: number;
    version: number = 3;
    gamePanelHideBannerDelay: number = 0;

    mistakeConfig: any = null;

    gameDatas: GameDataItem[] = [];

    cityData: any = null;

    isNew: boolean = true;

    gameCurVersion: string = "v1.0.02";

    settingData: any = null;

    alwaysBlack = -1;

    isBalck: boolean = true;

    useSetWhite_version = 1;

    /** 当前更多游戏按钮展示的游戏ID */
    private moreGameBtnIndex: number = -1;

    getMoreBtnGame() {
        const { gameDatas } = this

        this.moreGameBtnIndex++
        if (this.moreGameBtnIndex >= gameDatas.length) {
            this.moreGameBtnIndex = 0
        }

        return gameDatas[this.moreGameBtnIndex]
    }

    updateIsShowAd({
        crazy_click_config,
        bannerIds,
        useSetWhite_version,
        without_sceneList,
        without_cityList,
        gamePanel_hide_banner_delay,
        videoId,
        shareTitles,
        shareUrl,
    }, config?) {

        bannerManager.gatBannerInfo(bannerIds);
        VideoOrShareManager.getConfig({ videoId, shareTitles, shareUrl })

        this.gamePanelHideBannerDelay = (gamePanel_hide_banner_delay != undefined &&
            gamePanel_hide_banner_delay != null) ? gamePanel_hide_banner_delay : 0;

        this.mistakeConfig = crazy_click_config;
        /* if (show_hu_tui_when_in_blacklist) this.showHutui = show_hu_tui_when_in_blacklist
        if (show_juhe_in_Over) this.showJuheInOver = show_juhe_in_Over; */




        const { scene } = this

        let localQuery = cc.sys.localStorage.getItem("local_query");
        let ald_media_id = localQuery ? JSON.parse(localQuery).ald_media_id : null;
        let aldad = localQuery ? JSON.parse(localQuery).aldad : null;
        let wxgamecid = localQuery ? JSON.parse(localQuery).wxgamecid : null;

        ald.sendEvent("list_进入判断黑白名单");
        ald.sendEvent("list_登录信息", { "localQuery": localQuery });

        let localData = cc.sys.localStorage.getItem("local_isBlack_1");
        let localBlack = -1;
        if (localData != undefined && localData != null && localData !== "") {
            localBlack = parseInt(localData);
            console.log("本地黑名单信息", localBlack, ",localData = ", localData);
        } else {
            console.log("本地无黑名单数据，读取服务数据", config);
            if (config) {
                localBlack = config.alwaysBlack;
                cc.sys.localStorage.setItem("local_isBlack_1", localBlack);
            }
        }

        let isNew: boolean = false;
        if (localBlack != null && localBlack != undefined && localBlack != -1) {
            //toastManager.toastShow("老用户进入," + localBlack + "," + localData + "," + JSON.stringify(config));
            console.log("老用户进入", localBlack);
            console.log("localQuery值判断", localQuery, (ald_media_id != undefined && ald_media_id != null), (aldad != undefined && aldad != null), (wxgamecid != undefined && wxgamecid != null));
            if (localBlack === 0) {
                //非黑名单用户
                this.isBalck = false;
                this.alwaysBlack = 0;
            } else {
                //黑名单用户
                this.isBalck = true;
                this.alwaysBlack = 1;
            }
        } else {
            isNew = true;
            //toastManager.toastShow("新用户判断是否进入黑名单," + (ald_media_id != undefined && ald_media_id != null) + "," + (aldad != undefined && aldad != null));
            console.log("新用户判断是否进入黑名单", localQuery);
            if ((ald_media_id != undefined && ald_media_id != null) || (aldad != undefined && aldad != null) || (wxgamecid != undefined && wxgamecid != null)) {
                //用户不进入黑名单
                this.isBalck = false;

                cc.sys.localStorage.setItem("local_isBlack_1", 0);
                this.alwaysBlack = 0;

                ald.sendEvent("list_新用户白名单");
                console.log("用户进入白名单");
            } else {
                //用户进入黑名单
                this.isBalck = true;

                cc.sys.localStorage.setItem("local_isBlack_1", 1);
                this.alwaysBlack = 1;

                ald.sendEvent("list_新用户黑名单");
                console.log("用户进入黑名单");
            }
        }

        if (this.isBalck) {
            ald.sendEvent("list_黑名单");
        } else {
            ald.sendEvent("list_白名单");
        }
        HeartbeatSchedule.instance.send();
        console.log("是否黑名单", this.isBalck);

        var temp = cc.sys.localStorage.getItem("white_test_check");
        if (parseInt(temp) === 1) {
            this.isBalck = false;
            console.log("测试用户是否为黑名单", this.isBalck);
        }

        if (this.isBalck === true && useSetWhite_version === this.useSetWhite_version) {
            console.log("判断是否进入临时白名单", this.cityData)
            if (this.cityData) {
                let isWhiteCity = true;
                let cname = (this.cityData.cname as string);
                for (const key in without_cityList) {
                    if (without_cityList.hasOwnProperty(key)) {
                        const element = without_cityList[key];
                        if (cname.includes(element)) {
                            isWhiteCity = false;
                            break;
                        }
                    }
                }
                if (isWhiteCity && without_sceneList && (without_sceneList as Array<number>).includes(scene) === false) {
                    this.isBalck = false;
                    ald.sendEvent("list_黑名单用户进入临时白名单");
                    console.log("黑名单用户进入临时白名单", cname, scene);
                }
            }
        }

        //console.log(this.showAd, this.showShare, config)
    }

    //将用户拉出黑名单
    setUserWithoutBlack() {
        this.alwaysBlack = -1;
        HeartbeatSchedule.instance.send();
    }

    checkShowMistake(level: number): boolean {
        console.log("误触控制数据：", this.mistakeConfig);
        console.log("当前关卡为：", level);
        if (this.isBalck === true) return false;
        if (!this.mistakeConfig) return false;
        const { switchVer, start_level, space_level } = this.mistakeConfig;
        if (switchVer === true) {
            let space = level - start_level;
            if (space >= 0 && space % (space_level + 1) == 0) {
                return true;
            }
        }
        return false;
    }
}

export default new GameData();