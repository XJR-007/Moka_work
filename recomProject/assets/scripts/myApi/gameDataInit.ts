import { isWechat } from "./system";
import userStore from "./userStore";
import wxApi from "./wxApi";
import sleep from "./sleep";
import handleUserInitData from './handleUserInitData'
import GameData from "../GameData";
import { HttpApi } from "./HttpApi";
import api from "./api";

function init() {
    console.log("wx init ....");
    let localQuery = cc.sys.localStorage.getItem("local_query");
    if (!localQuery) {
        let { query } = wxApi.getLaunchOptionsSync();
        cc.sys.localStorage.setItem("local_query", JSON.stringify(query));
    }
    if (isWechat || window["wx"] != undefined) {
        return wechatInit();
    } else {
        return developInit();
    }
}

function developInit() {

    userStore.token = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MjE2NDM1NTcsImV4cCI6MTU4MTA2NjU3Nn0.ale7Pj1ySsyBOeBGXI9DcFSZbsRAJA8aZc5Klj42V3Q";

    return userDataInit()
}

async function wechatInit() {

    try {
        // await wechat.checkSession()

        const token = wxApi.getStorage('token')
        console.log("token  ", token)
        if (token) {
            //   userStore.update({ token })
            userStore.token = token

            await userDataInit()
        } else {

            await login()
        }
    } catch (e) {
        await login()
        /* if (!wxUtils.getStorage('token')) {
          analytics.sendEvent('log_newPlayer')
        } */
    }
}

async function login() {
    console.log("await wxUtils.login()")
    const { code } = await wxApi.login();

    const res: any = await api.auth(code);

    console.log("await wxUtils.login() code ", code)

    console.log("ny = await api.auth res.data ", res)

    const { token } = res.data

    console.log(res, token, 'code')

    wxApi.setStorage('token', token)

    console.log("token==>", token)

    userStore.token = token

    /*  userStore.update({
       token,
     }) */

    await userDataInit()
}

// let tryTime = 0

async function userDataInit() {
    /* if (tryTime > 5) {
      exitGame('服务器繁忙')
    } */

    //   tryTime++

    try {

        console.log("服务器获取数据初始化")
        const getLaunchOptionsSync = wxApi.getLaunchOptionsSync()
        console.log(getLaunchOptionsSync)
        const scene = getLaunchOptionsSync.scene
        const { appId, extraData } = getLaunchOptionsSync.referrerInfo
        let info = {}
        if (appId) {
            info = { scene, "from_appid": appId }
            if (extraData) {
                if (extraData.zjOpenid) {
                    info = { scene, "from_appid": appId, "from_openid": extraData.zjOpenid }
                }
            }
        } else {
            info = { scene }
        }
        const { data }: any = await api.peopleInit(info);

        GameData.scene = getLaunchOptionsSync.scene;

        console.log('api login init data userDataInit', data)

        const { code } = data

        if (code === 200) {
            console.log("初始化成功")
            if (window["wx"]) {
                let res = await HttpApi.promiseGET("https://pv.sohu.com/cityjson?ie=utf-8");
                var m = JSON.parse(res.match(/.*(\{[^\}]+\}).*/)[1] || '{}')
                console.log('ip =>', m.cip, m)
                GameData.cityData = m;
            }
            return handleUserInitData(data)
        } else if (code === 202) {
            console.log("初始化繁忙")
            await sleep(5)
            await userDataInit()
        } else if (code === 401) {
            // exitGame('找不到玩家')
            console.log("找不到玩家")
            await login()
        } else {
            //   exitGame('初始化错误')
            console.log("初始化错误")
        }
    } catch (e) {
        console.error(e)
        await sleep(5)
        await userDataInit()
    }

}

export default init