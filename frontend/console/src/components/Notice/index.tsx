import { BellOutlined } from '@antdv-next/icons'
import { ProListy } from '@antdv-next1/pro-listy'
import { Dropdown, Badge, Menu, Spin, Tabs } from 'antdv-next'
import { defineComponent } from 'vue'
export default defineComponent<{
  count?: number
  loading?: boolean
}>(
  (props = { count: 0, loading: false }) => {
    const { t } = useI18n()
    return () => {
      const { count, loading } = props
      return (
        <Dropdown
          placement="bottomRight"
          trigger={['click']}
          popupRender={() => (
            <Menu>
              <Spin spinning={loading}>
                <Tabs
                  centered
                  items={[
                    {
                      label: t('global.notice'),
                      key: '1',
                      content: (
                        <div>
                          <ProListy items={[]} rowKey="id" />
                          <div>
                            <div>{t('global.empty.notice')}</div>
                            <div>{t('global.see.more')}</div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      label: t('global.message'),
                      key: '2',
                      content: 'sad',
                    },
                    {
                      label: t('global.todo'),
                      key: '3',
                      content: 'sad',
                    },
                  ]}
                />
              </Spin>
            </Menu>
          )}
          v-slots={{
            default: () => (
              <Badge count={count}>
                <BellOutlined class="text-4" />
              </Badge>
            ),
          }}
        />
      )
    }
  },
  {
    name: 'Notice',
    inheritAttrs: false,
  },
)