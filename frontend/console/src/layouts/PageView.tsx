import { PageContainer, type PageContainerProps } from '@antdv-next1/pro-layout'
import { KeepAlive, Transition, type VNode, watch } from 'vue'
import { type RouteLocationNormalizedLoaded, RouterView } from 'vue-router'

import { usePageContainer } from '@/hooks/usePageContainer'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
export default defineComponent({
  name: 'PageView',
  setup() {
    const appStore = useAppStore()
    const route = useRoute()
    const tagsViewStore = useTagsViewStore()
    const cachedViews = computed(() => tagsViewStore.cachedViews)
    const { createPageContainerProps } = usePageContainer()
    const pageContainerProps = shallowRef({} as PageContainerProps)
    createPageContainerProps({
      setPageContainerProps: (props) => {
        pageContainerProps.value = props
      },
    })
    watch(
      () => route.path,
      () => {
        pageContainerProps.value = {}
      },
    )
    return () => {
      return (
        <PageContainer {...pageContainerProps.value}>
          {/* avatar={{ src: 'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1' }} */}
          <RouterView>
            {({
              Component: Content,
              route: R,
            }: {
              Component: VNode
              route: RouteLocationNormalizedLoaded
            }) => {
              return (
                <Transition name={appStore.transitionName} mode="out-in" appear>
                  {R.meta.keepAlive ? (
                    <KeepAlive include={cachedViews.value}>{Content}</KeepAlive>
                  ) : (
                    Content
                  )}
                </Transition>
              )
            }}
          </RouterView>
        </PageContainer>
      )
    }
  },
})