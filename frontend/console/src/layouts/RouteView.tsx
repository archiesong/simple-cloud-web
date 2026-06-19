import { GridContent } from '@antdv-next1/pro-layout'
import { KeepAlive, Transition, type VNode } from 'vue'
import { type RouteLocationNormalizedLoaded, RouterView } from 'vue-router'

import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
export default defineComponent({
  name: 'RouteView',
  setup(_, { slots }) {
    const appStore = useAppStore()
    const tagsViewStore = useTagsViewStore()
    const cachedViews = computed(() => tagsViewStore.cachedViews)
    return () => (
      <GridContent>
        <RouterView>
          {({
            Component: Content,
            route: R,
          }: {
            Component: VNode
            route: RouteLocationNormalizedLoaded
          }) => (
            <Transition name={appStore.transitionName} mode="out-in" appear>
              {R.meta.keepAlive ? (
                <KeepAlive include={cachedViews.value}>{Content || slots.default?.()}</KeepAlive>
              ) : (
                Content || slots.default?.()
              )}
            </Transition>
          )}
        </RouterView>
      </GridContent>
    )
  },
})