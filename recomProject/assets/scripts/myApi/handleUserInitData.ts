import sign from "./sign";
import GameData from "../GameData";
import ald from "./ald";



function handleInitUserData(data) {
  return new Promise((resolve, reject) => {

    try {
      cc.log('handle init user data', data)
      console.log(sign.check(data))

      if (!sign.check(data)) {
        // exitGame('数据校验出错')
        console.log('数据校验错误')
        return
      }



      console.log('server data0', data)
      // Object.assign(data, JSON.parse(data.data))
      var objData = null
      data.data && (objData = JSON.parse(data.data));

      if (data.openid) {
        cc.sys.localStorage.setItem("openid", data.openid);
        //阿拉丁上报openId
        ald.sendOpenid(data.openid)
      }

      console.log("objData.gamedata", objData.gamedata, objData);



      var gameboxData = null;
      data.gameboxes && (gameboxData = data.gameboxes);
      if (gameboxData) {
        //互推盒子
        GameData.gameDatas = [...gameboxData];
      }



      var settingData = null;
      settingData = data.settings;

      if (objData.userData) {
        let userData = JSON.parse(objData.userData);
        console.log("后端用户数据：", userData, userData.config);

        //Wxapi.wechatolderInit(objData.gamedata, { code: "255255252525252525uiy" });
        // GameData.getinstance().initData(objData.gamedata);

      } else {
        // Wxapi.weChatNewInit({ code: "255255252525252525uiy" })
        // GameData.getinstance().setData();

      }


      if (settingData) {
        console.log("GameData.settingsData = settingData", settingData);
        //后台配置
        GameData.settingData = settingData;

        //是否新用户
        GameData.isNew = data.is_new;

        objData.config ? GameData.updateIsShowAd(settingData.options, objData.config) : GameData.updateIsShowAd(settingData.options);
      }

      resolve(data)

    } catch (e) {

      reject(e)

    }
  })
}

export default handleInitUserData


