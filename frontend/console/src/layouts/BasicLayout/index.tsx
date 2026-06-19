import type { ProSettings } from '@antdv-next1/pro-layout'

import { GithubOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@antdv-next/icons'
import { DefaultFooter, ProLayout, SettingDrawer } from '@antdv-next1/pro-layout'
import { Dropdown, Watermark } from 'antdv-next'
import { computed } from 'vue'
import { RouterView } from 'vue-router'

import logo from '@/assets/logo.png'
import Notice from '@/components/Notice'
import SelectLang from '@/components/SelectLang'
import { useGlobSetting } from '@/hooks/setting'
import { i18nRender } from '@/locales'
import setting from '@/settings/projectSetting'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'

const globSetting = useGlobSetting()

export default defineComponent({
  name: 'BasicLayout',
  inheritAttrs: false,
  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    const collapsed = ref(false)
    const route = useRoute()
    const state = computed(() => ({
      navTheme: appStore.navTheme,
      colorPrimary: appStore.colorPrimary,
      layout: appStore.layout,
      compact: appStore.compact,
      contentWidth: appStore.contentWidth,
      splitMenus: appStore.splitMenus,
      colorWeak: appStore.colorWeak,
      fixedHeader: appStore.fixedHeader,
      transitionName: appStore.transitionName,
      fixedSiderbar: appStore.fixedSiderbar,
      siderMenuType: appStore.siderMenuType,
    }))
    const handleSettingChange = (arg: Record<string, string | boolean>) => {
      Object.keys(arg).forEach((key) => {
        if ('navTheme' === key) {
          appStore.setNavTheme(arg[key] as ProSettings['navTheme'])
        }
        if ('compact' === key) {
          appStore.setCompact(arg[key] as boolean)
        }
        if ('colorWeak' === key) {
          appStore.setColorWeak(arg[key] as boolean)
        }
        if ('colorPrimary' === key) {
          appStore.setColorPrimary(arg[key] as string)
        }
        if ('siderMenuType' === key) {
          appStore.setSiderMenuType(arg[key] as ProSettings['siderMenuType'])
        }
        if ('transitionName' === key) {
          appStore.setTransitionName(arg[key] as string)
        }
        if ('fixedHeader' === key) {
          appStore.setFixedHeader(arg[key] as boolean)
        }
        if ('fixedSiderbar' === key) {
          appStore.setFixedSiderbar(arg[key] as boolean)
        }
        if ('contentWidth' === key) {
          appStore.setContentWidth(arg[key] as ProSettings['contentWidth'])
        }
        if ('splitMenus' === key) {
          appStore.setSplitMenus(arg[key] as boolean)
        }
        if ('layout' === key) {
          appStore.setLayout(arg[key] as ProSettings['layout'])
        }
      })
    }
    const appList = reactive([
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        title: 'Ant Design',
        desc: '杭州市较知名的 UI 设计语言',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        title: 'AntV',
        desc: '蚂蚁集团全新一代数据可视化解决方案',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
        title: 'Pro Components',
        desc: '专业级 UI 组件库',
      },
      {
        icon: 'https://img.alicdn.com/tfs/TB1zomHwxv1gK0jSZFFXXb0sXXa-200-200.png',
        title: 'umi',
        desc: '插件化的企业级前端应用框架。',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/8a74c1d3-16f3-4719-be63-15e467a68a24/km0cv8vn_w500_h500.png',
        title: 'qiankun',
        desc: '可能是你见过最完善的微前端解决方案🧐',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
        title: '语雀',
        desc: '知识创作与分享工具',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/LFooOLwmxGLsltmUjTAP.svg',
        title: 'Kitchen ',
        desc: 'Sketch 工具集',
        url: 'javascript:void',
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d3e3eb39-1cd7-4aa5-827c-877deced6b7e/lalxt4g3_w256_h256.png',
        title: 'dumi',
        desc: '为组件开发场景而生的文档工具',
      },
    ])
    const bgLayoutImgList = reactive([
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ])
    return () => {
      return (
        <Watermark content="Antdv Next Pro">
          <ProLayout
            {...state.value}
            logo={logo}
            menu={setting.menu}
            collapsed={collapsed.value}
            onCollapse={(_collapsed) => {
              collapsed.value = _collapsed
            }}
            title={setting.title}
            style={{ minHeight: '100vh' }}
            appList={appList}
            location={{
              path: route.path,
            }}
            bgLayoutImgList={bgLayoutImgList}
            formatMessage={(message) => i18nRender(message.id) || message.defaultMessage}
            route={permissionStore.routes.find((item) => item.path === '/')}
            avatarProps={{
              title: userStore.name,
              size: 'small',
              src: globSetting.urlPrefix + userStore.avatar,
              render: (_, defaultDom) => (
                <Dropdown
                  placement="bottomRight"
                  classes={{
                    root: 'ant-pro-dropdown',
                  }}
                  menu={{
                    classes: {
                      root: 'ant-pro-dropdown-menu',
                    },
                    items: [
                      {
                        key: 'center',
                        label: '个人中心',
                        icon: UserOutlined,
                      },
                      {
                        key: 'settings',
                        label: '个人设置',
                        icon: SettingOutlined,
                      },
                      {
                        type: 'divider',
                      },
                      {
                        key: 'logout',
                        label: '退出登录',
                        icon: LogoutOutlined,
                      },
                    ],
                  }}
                >
                  {defaultDom}
                </Dropdown>
              ),
            }}
            footerRender={({ props }) => {
              return (
                <DefaultFooter
                  {...props}
                  links={[
                    { title: <>Antdv Next</>, href: 'https://www.antdv-next.cn' },
                    {
                      key: 'github',
                      title: <GithubOutlined />,
                      blankTarget: false,
                      href: 'void(0);',
                    },
                    {
                      title: <>Buy Now!</>,
                      blankTarget: false,
                      href: 'void(0);',
                    },
                  ]}
                  copyright="xxx科技有限公司"
                />
              )
            }}
            actionsRender={() => [<Notice />, <SelectLang />]}
          >
            <RouterView />
            <SettingDrawer {...state.value} onSettingChange={handleSettingChange} />
          </ProLayout>
        </Watermark>
      )
    }
  },
})