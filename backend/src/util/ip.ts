import { Init, Provide, Singleton } from '@midwayjs/core';
import IP2Region from 'ip2region';

@Provide()
@Singleton()
export class IPUtils {
  private searcher: InstanceType<typeof IP2Region>;
  @Init()
  async init() {
    this.searcher = new IP2Region();
  }
  /**
   * 查询IP地址信息
   */
  query(ip: string) {
    if (!ip || ip === '::1') {
      return { ip, isLocal: true };
    }
    const ipv4 = ip.replace('::ffff:', '');

    const result = this.searcher.search(ipv4);
    return {
      ip: ipv4,
      ...result,
    };
  }
  /**
   * 批量查询IP
   */
  batchQuery(ips: string[]) {
    return ips.map(ip => this.query(ip));
  }
}
