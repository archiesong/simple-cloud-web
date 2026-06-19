import type { PageContainerProps } from '@antdv-next1/pro-layout'
import type { InjectionKey } from 'vue'

export interface PageContainerContextProps {
  setPageContainerProps: (props: PageContainerProps) => void
}
const pageContainerPropsContextKey: InjectionKey<PageContainerContextProps> = Symbol(
  'pageContainerPropsContext',
)
export const usePageContainer = () => {
  return {
    createPageContainerProps: (props: PageContainerContextProps) =>
      provide(pageContainerPropsContextKey, props),
    usePageContainerProps: () =>
      inject(pageContainerPropsContextKey, {} as PageContainerContextProps),
  }
}