import { post, get } from "./request"
import sign from './sign';


const reset = window['reset'] = async () => post('/api/people/heartbeat', await sign.create({}))

export default {
  reset,
  auth: (code) => post('/wechat/basic_auth', { app_token: "ldyZWE", code: code }), //post(`/wechat/basic_auth`, { app_token: 'nEO0mg', code }),
  heartbeat: data => post('/api/people/heartbeat', data), // post('/api/people/heartbeat', data),
  // peopleInit: data => get('/api/people/init', data),
  peopleInit: (data) => get('/api/people/init', data), //get('/api/people/init', data),
  clearData: (data) => get('/api/people/clear_data', { token: data })
}
