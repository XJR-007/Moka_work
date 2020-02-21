const env = {
  isProduction: false,
}

const config = {
  env,
  requestURL: 'https://game.h6es.cn/',//`https://auroth.cn`,
  // requestURL: env.isProduction ? 'https://monster.1to10.cn' : 'https://monster-staging.1to10.cn',
  // cdn: 'https://kun-1258233946.cos.ap-guangzhou.myqcloud.com/monsters',
  // cdn: 'http://kuncdn.1to10.cn/monsters',
  cdn: 'https://kun-cdn.1to10.cn/letusgo',
  version: 1,
  cdnVersion: `v2`,
  showAnnouncementDialog: true
}

export default config
