import * as gravatar from 'gravatar'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { User } from '@module/user/user.entity'
import { PaginateResult } from '@interface/app.interface'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
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

  async createUser(user: Partial<User>): Promise<User> {
    const exist = await this.userRepository.findOne({
      where: { name: user.name }
    })
    if (exist) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }

    const avatarUrl = gravatar.url(user.email)
    user.avatar = avatarUrl
    const model = this.userRepository.create(user)
    await this.userRepository.save(model)
    return model
  }

  async findAll(
    query: Record<string, string | number>
  ): Promise<PaginateResult<User>> {
    const [page, pageSize] = [query.page || 1, query.pageSize || 12].map((v) =>
      Number(v)
    )

    const [data, total] = await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount()

    const totalPage = Math.ceil(total / pageSize) || 1

    return { data, total, page, pageSize, totalPage }
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id)
  }

  async login(user: Pick<User, 'name' | 'password'>): Promise<User> {
    const { name, password } = user
    const exist = await this.userRepository.findOne({ where: { name } })

    if (!exist || !(await User.comparePassword(password, exist.password))) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST)
    }

    return exist
  }

  async update(id: string, body: Partial<User>): Promise<User> {
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
    body: Pick<User, 'password' | 'newPassword' | 'relNewPassword'>
  ): Promise<User> {
    const exist = await this.userRepository.findOne(id)
    const { password, newPassword, relNewPassword } = body

    if (!exist) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }

    if (!(await User.comparePassword(password, exist.password))) {
      throw new HttpException('原密码错误', HttpStatus.BAD_REQUEST)
    }

    if (newPassword !== relNewPassword) {
      throw new HttpException('两次密码不一致', HttpStatus.BAD_REQUEST)
    }

    const hash = User.encryptPassword(relNewPassword)

    const newUser = this.userRepository.merge(exist, { password: hash })
    return await this.userRepository.save(newUser)
  }

  async remove(id: string): Promise<User> {
    const exist = await this.userRepository.findOne(id)
    if (!exist) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }
    return await this.userRepository.remove(exist)
  }
}
