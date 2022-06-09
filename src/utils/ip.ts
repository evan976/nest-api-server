// eslint-disable-next-line @typescript-eslint/no-var-requires
const ipSearcher = require('node-ip2region').create()

export function getClientIP(req: any) {
  const ip =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    (req.connection && req.connection.remoteAddress) ||
    (req.socket && req.socket.remoteAddress) ||
    (req.connection &&
      req.connection.socket &&
      req.connection.socket.remoteAddress)

  return ip ? ip.split(':').pop() : ''
}

export function parseIp(ip: string) {
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
