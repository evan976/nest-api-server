import { get } from 'lodash'
import UAParser from 'ua-parser-js'

const keys = [
  'browser.name',
  'browser.version',
  'engine.name',
  'engine.version',
  'os.name',
  'os.version',
  'device.vendor',
  'device.model',
  'device.type',
]

const join = (ua: UAParser.IResult, keys: any[]) =>
  keys
    .map((key) => get(ua, key))
    .filter(Boolean)
    .join(' ')

export const parseUserAgent = (userAgent: string) => {
  const uaparser = new UAParser()
  uaparser.setUA(userAgent)
  const ua = uaparser.getResult()

  return {
    data: {
      browser: join(ua, keys.slice(0, 2)),
      engine: join(ua, keys.slice(2, 4)),
      os: join(ua, keys.slice(4, 6)),
      device: join(ua, keys.slice(6)),
    },
    text: join(ua, keys),
  }
}
