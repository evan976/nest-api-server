import * as request from 'request'
import { Request } from 'express'

export function getClientIP(req: Request) {
  let ip = (req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.socket.remoteAddress ||
    req.ip ||
    req.ips[0]) as string
  ip = ip.replace('::ffff:', '')
  return ip
}

export function parseIp(ip: string): Promise<any> {
  return new Promise((resolve, reject) => {
    request(
      {
        url: `http://apis.juhe.cn/ip/ipNewV3?ip=${ip}&key=${process.env.JUHE_API_KEY}`
      },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const result = JSON.parse(body)
          if (result && result.resultcode == 200) {
            resolve(result.result)
          } else {
            console.log(ip)
            reject(result)
          }
        } else {
          console.log(ip)
          reject(error || response.statusMessage)
        }
      }
    )
  })
}
