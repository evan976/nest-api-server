import * as url from 'url'
import * as qiniu from 'qiniu'
import {
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '@/guard/jwt-auth.guard'
import { Role } from '@/guard/role.guard'
import { ApiOperation } from '@nestjs/swagger'

@Controller('config')
export class ConfigController {
  constructor(private readonly configServie: ConfigService) {}

  @ApiOperation({ summary: '图片上传' })
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const mac = new qiniu.auth.digest.Mac(
      this.configServie.get('QINIU_ACCESSKEY'),
      this.configServie.get('QINIU_SECRETKEY')
    )
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.configServie.get('QINIU_SCOPE'),
    })
    const uploadToken = putPolicy.uploadToken(mac)

    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z2,
      })
    )

    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      formUploader.put(
        uploadToken,
        `${Date.now()}-${file.originalname}`,
        file.buffer,
        new qiniu.form_up.PutExtra(),
        function (respErr, respBody, respInfo) {
          if (respErr) {
            console.error(respErr)
            throw new InternalServerErrorException(respErr.message)
          }
          if (respInfo.statusCode == 200) {
            resolve({
              url: new url.URL(
                respBody.key,
                self.configServie.get('QINIU_HOST')
              ).href,
            })
          } else {
            console.error(respInfo.statusCode, respBody)
            throw new InternalServerErrorException(respInfo)
          }
        }
      )
    })
  }
}
