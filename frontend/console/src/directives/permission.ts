import type { Directive } from 'vue'

import { useUserStore } from '@/store/modules/user'

const removeElement = (el: HTMLElement) => {
  el.parentNode?.removeChild(el)
}

export const permissionDirective = {
  mounted(el, binding) {
    const value = binding.value
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return
    }

    const userStore = useUserStore()
    if (!userStore.hasPermission(value)) {
      removeElement(el)
    }
  },
} satisfies Record<string, NonNullable<Directive<HTMLElement, string | string[]>['mounted']>>

const permission: Directive<HTMLElement, string | string[]> = permissionDirective

export default permission
