// eslint-disable-next-line @typescript-eslint/no-var-requires
const ipSearcher = require('node-ip2region').create()
import { Request } from 'express'

export function getClientIP(req: Request) {
  const ip =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    (req.socket && req.socket.remoteAddress) // 判断后端的 socket 的 IP

  return ip ? (<string>ip).split(':').pop() : ''
}

export function parseIp(ip: any) {
  try {
    const { region } = ipSearcher.btreeSearchSync(ip)
    return region
      .split('|')
      .filter((d: string | number) => +d !== 0)
      .join(' ')
  } catch (e) {
    return ''
  }
}
