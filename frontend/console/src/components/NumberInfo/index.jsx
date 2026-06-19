import './index.less'
import { createVNode, resolveComponent } from 'vue'

export default defineComponent({
  name: 'NumberInfo',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-number-info',
    },
    total: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    subTitle: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'up',
    },
  },
  setup(props, context) {
    return () => (
      <div class={props.prefixCls}>
        <div class={[`${props.prefixCls}-sub-title`]}>
          {props.subTitle ? props.subTitle : context.slots.subTitle?.()}
        </div>
        <div class="number-info-value">
          <span>{props.total}</span>
          <span class="sub-total">
            {props.subTotal}
            {createVNode(resolveComponent(`caret-${props.status}-outlined`, null, null))}
          </span>
        </div>
      </div>
    )
  },
})