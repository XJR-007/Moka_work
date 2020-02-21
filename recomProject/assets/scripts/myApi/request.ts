import config from './config';
import {
    isWechat
} from './system';
import flyio from 'flyio';
import userStore from './userStore';

flyio.config.timeout = 9000;

function request(method, url, data) {
    flyio.config.baseURL = config.requestURL;
    if (isWechat) {
        console.log("!!!!!!!!!!!!!!", flyio.config.baseURL);
        return new Promise((success, fail) => {
            console.log(config.requestURL + url, data);
            window["wx"].request({
                method,
                url: config.requestURL + url,
                data,
                success,
                fail,
            })
        })
    } else {
        if (method === 'GET')
            return flyio.get(url, data)
        else
            return flyio.post(url, data)
    }
}

export default request

export const get = (url, data: any = {}) => {
    if (userStore.token) {
        data.token = userStore.token
        data.version = config.version
        url += `?version=${config.version}`
    }
    console.log("request get url =", url, data);
    return request('GET', url, data)
}

export const post = (url, data: any = {}) => {
    if (userStore.token) {
        //url += `?token=${userStore.token}`
        url += `?token=${userStore.token}&version=${config.version}`
    }
    // url += `?token=${userStore.token}&version=${config.version}`
    console.log("request post url =", url);
    return request('POST', url, data)
}