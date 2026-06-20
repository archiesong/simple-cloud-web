import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import IconView from '../index'

describe('IconView', () => {
  it('wraps custom svg icons with the Antdv Icon component for menu spacing', () => {
    const wrapper = mount(IconView, {
      attrs: {
        class: 'ant-menu-item-icon custom-menu-icon',
      },
      props: {
        icon: 'svg:dashboard',
      },
    })

    const icon = wrapper.find('span.anticon')

    expect(icon.classes()).toContain('ant-menu-item-icon')
    expect(icon.classes()).toContain('custom-menu-icon')
    expect(icon.find('svg use').attributes('href')).toBe('#dashboard')
  })
})
