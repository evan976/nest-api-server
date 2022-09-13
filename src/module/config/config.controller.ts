import * as url from 'url'
import * as qiniu from 'qiniu'
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { ConfigEntity } from '@module/config/config.entity'
import { ConfigService as OptionService } from '@module/config/config.service'
import { JwtAuthGuard } from '@/guard/jwt-auth.guard'
import { Role, RoleGuard } from '@/guard/role.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('配置')
@Controller('config')
@UseGuards(RoleGuard)
export class ConfigController {
  constructor(
    private readonly configServie: ConfigService,
    private readonly optionService: OptionService
  ) {}

  @ApiOperation({ summary: '文件上传' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const mac = new qiniu.auth.digest.Mac(
      this.configServie.get('QINIU_ACCESSKEY'),
      this.configServie.get('QINIU_SECRETKEY')
    )
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.configServie.get('QINIU_SCOPE')
    })
    const uploadToken = putPolicy.uploadToken(mac)

    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z2
      })
    )

    return new Promise((resolve) => {
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
              ).href
            })
          } else {
            console.error(respInfo.statusCode, respBody)
            throw new InternalServerErrorException(respInfo)
          }
        }
      )
    })
  }

  @ApiOperation({ summary: '获取网站配置' })
  @Get('option')
  async find() {
    return this.optionService.find()
  }

  @ApiOperation({ summary: '获取网站数据' })
  @Get('site/data')
  async findSiteData() {
    return this.optionService.findSiteData()
  }

  @ApiOperation({ summary: '更新网站配置' })
  @UseGuards(JwtAuthGuard)
  @Role('admin')
  @Put('option')
  async update(@Body() body: Partial<ConfigEntity>) {
    return this.optionService.update(body)
  }
}
