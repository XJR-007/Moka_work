import wxApi from "./wxApi";
import heartbeatStore from "./heartbeatStore";
import sign from "./sign";
import api from "./api";
/**
 * 这个是专门用来做心跳的
 *
 * @class HeartbeatSchedule
 */
export default class HeartbeatSchedule {

  public static get instance() {
    return HeartbeatSchedule._instance;
  }
  private static _instance: HeartbeatSchedule = new HeartbeatSchedule();

  getSchedular(): cc.Scheduler {
    return cc.director.getScheduler()
  }

  restart() {
    this.stop()

    this.getSchedular().schedule(this.emitEvent, cc.director.getScene(), 10)
    wxApi.onHide(this.emitEvent)
  }

  start() {
    this.restart()
  }

  send = async () => {
    /*  const actions = heartbeatStore.actions
 
     heartbeatStore.actions = [] */

    // console.log('heartbeat schedule start')

    try {

      const { data }: any = await api.heartbeat(await sign.create(heartbeatStore.getHeartbeatData()))

      // console.log('sign')
      // console.log('data',data)
      const code = data.code

      // { code: 200, user_gold：123456 }
      if (code === 200) {
        // userStore.update({
        //   gold: data.user_gold
        // })
      }

      // { code: 201 } - 操作不合法，需要重新调init接口
      else if (code === 402) {
        // exitGame('操作不合法')
        console.log('操作不合法')
      }

      // { code: 202 } - 该用户数据正在被写入，需重新请求
      /* else if (code === 202) {
        this.restoreActions(actions)
      } */

      // { code: 401, msg: '找不到 person' }
      else if (code === 401) {
        // exitGame('找不到该玩家')
        console.log('找不到该玩家')
      }
    } catch (e) {
      //console.error(e)
      console.log(e);
      //   this.restoreActions(actions)
    }
  }

  restoreActions(actions) {
    // heartbeatStore.actions = [...actions, ...heartbeatStore.actions]
  }

  emitEvent = () => {
    //储存离线时间
    // storage.set(OFFLINE_TIME, new Date().getTime())
    this.send()
  }

  stop() {
    this.getSchedular().unschedule(this.emitEvent, cc.director.getScene())
  }
}
