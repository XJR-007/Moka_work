export const isWechat = cc.sys.WECHAT_GAME === cc.sys.platform

export default {
  isWechat,
  ...cc.sys
}