import {EnvConfig} from "./env-config.service";
/**
 * 生产环境前后端访问配置
 */
export const EnvConfigData: EnvConfig = {

  env: {
    // 是否使用生产环境URL配置，默认开发环境为false
    isUseProdUrlConfig: false
  },
  // 前后台部署URL
  backendList: [
    // 测试环境
    {
      local: "http://cpadis.cpad.gov.cn:8100/cpad",
      defaultBackend: "http://cpadis.cpad.gov.cn:8100/cpad_new/api",
      reportBackend: "http://cpadis.cpad.gov.cn:8100/cpad_new/api"
    },
    // 第六分区
    {
      local: "http://cpadisc6.cpad.gov.cn/cpad",
      defaultBackend: "http://cpadisc6.cpad.gov.cn/cpad_new/api",
      reportBackend: "http://cpadisc6.cpad.gov.cn/report/api",
    }
  ]
}
