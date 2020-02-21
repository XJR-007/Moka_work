import * as md6 from "md5"

export async function check({ data, sign, timestamps }) {
  return sign === await createSign(data, timestamps)
}

export async function create(data) {
  const timestamps = new Date().getTime()
  console.log("data",data)
  return {
    data: JSON.stringify(data),
    sign: await createSign(JSON.stringify(data), timestamps),
    timestamps
  }
}

async function createSign(data, timestamps) {
  return md6(data+"j"+timestamps);//md6(data + await getCode(3) + timestamps)
}

function getCode(code) {
  return new Promise((res, rej) => {
    cc.loader.loadRes('name', (err, asset) => {
      cc.loader.load(asset.nativeUrl, function(err, result: string) {
        if(window['a2']) {
          res(result.toString()[code])
        } else {
          res(window['c1'])
        }
      })
    })
  })
}

export default {
  check,
  create
}
