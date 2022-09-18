import * as gravatar from 'gravatar'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { UserEntity } from '@module/user/user.entity'
import { PaginateService } from '@module/paginate/paginate.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly paginateService: PaginateService
  ) {
    const logger = new Logger()
    const name = this.configService.get('ADMIN_USER')
    const password = this.configService.get('ADMIN_PASSWORD')
    const email = this.configService.get('ACCOUNT')
    this.createUser({ name, password, email, role: 'admin' })
      .then(() => {
        logger.log(
          `管理员账号自动创建成功，用户名:${name}，默认密码:${password}`
        )
      })
      .catch(() => {
        logger.warn(`管理员账号已创建`)
      })
  }

  async createUser(user: Partial<UserEntity>) {
    const exist = await this.userRepository.findOne({
      where: { name: user.name }
    })
    if (exist) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }

    const avatarUrl = gravatar.url(user.email)
    user.avatar = avatarUrl
    const data = this.userRepository.create(user)
    await this.userRepository.save(data)
    return data
  }

  async findAll(query: Record<string, string | number>) {
    const { page = 1, page_size = 12 } = query
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.created_at', 'ASC')

    const result = await this.paginateService.paginate(queryBuilder, {
      page: +page,
      page_size: +page_size
    })

    return result
  }

  async findOne(id: string) {
    return this.userRepository.findOne(id)
  }

  async login(user: Pick<UserEntity, 'name' | 'password'>) {
    const { name, password } = user
    const exist = await this.userRepository.findOne({ where: { name } })

    if (
      !exist ||
      !(await UserEntity.comparePassword(password, exist.password))
    ) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST)
    }

    return exist
  }

  async update(id: string, body: Partial<UserEntity>) {
    const exist = await this.userRepository.findOne(id)
    if (!exist) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }

    if (body.name && body.name !== exist.name) {
      const existUser = await this.userRepository.findOne({
        where: { name: body.name }
      })

      if (existUser) {
        throw new HttpException('用户名已被注册', HttpStatus.BAD_REQUEST)
      }
    }

    const model = this.userRepository.merge(exist, body)
    return this.userRepository.save(model)
  }

  async updatePassword(
    id: string,
    body: Pick<UserEntity, 'password' | 'new_password' | 'rel_new_password'>
  ) {
    const exist = await this.userRepository.findOne(id)
    const { password, new_password, rel_new_password } = body

    if (!exist) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }

    if (!(await UserEntity.comparePassword(password, exist.password))) {
      throw new HttpException('原密码错误', HttpStatus.BAD_REQUEST)
    }

    if (new_password !== rel_new_password) {
      throw new HttpException('两次密码不一致', HttpStatus.BAD_REQUEST)
    }

    const hash = UserEntity.encryptPassword(rel_new_password)

    const newUser = this.userRepository.merge(exist, { password: hash })
    return await this.userRepository.save(newUser)
  }

  async remove(id: string) {
    const exist = await this.userRepository.findOne(id)
    if (!exist) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }
    return await this.userRepository.remove(exist)
  }
}
