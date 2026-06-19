import { ApiProperty } from '@midwayjs/swagger';

export class OnlineUserVo {
  constructor(
    id: string,
    username: string,
    nick: string,
    dept: string,
    browser: string,
    os: string,
    ip: string,
    address: string,
    encryptToken: string,
    loginTime: Date
  ) {
    this.uid = id;
    this.nick = nick;
    this.dept = dept;
    this.username = username;
    this.browser = browser;
    this.os = os;
    this.ip = ip;
    this.token = encryptToken;
    this.loginTime = loginTime;
    this.address = address;
  }
  @ApiProperty({
    description: 'Token编号',
  })
  uid: string;
  @ApiProperty({
    description: '用户名',
  })
  username: string;
  @ApiProperty({
    description: '昵称',
  })
  nick: string;
  @ApiProperty({
    description: '部门',
  })
  dept: string;
  @ApiProperty({
    description: '浏览器',
  })
  browser: string;
  @ApiProperty({
    description: '系统',
  })
  os: string;
  @ApiProperty({
    description: 'IP',
  })
  ip: string;
  @ApiProperty({
    description: '地址',
  })
  address: string;
  @ApiProperty({
    description: 'token',
  })
  token: string;
  @ApiProperty({
    description: '登录时间',
  })
  loginTime: Date;
}
