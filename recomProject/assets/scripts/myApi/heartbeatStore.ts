import GameData from "../GameData";



class Store {
    constructor() {

    }
}

class HeartbeatStore extends Store {
    lastHeatbeatAt: number = 0
    // GameData
    actions = []

    getHeartbeatData() {
        //用户信息
        let userData = null;

        //后台配置信息
        let config = {
            alwaysBlack: GameData.alwaysBlack,
        }
        
        return {
            config: config,
            userData: userData,//定时传送给服务器的数据
            offlineTime: new Date().getTime(),
        }
    }
}

export default new HeartbeatStore()
