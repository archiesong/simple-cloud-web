import './index.less'
export default defineComponent({
  name: 'RankList',
  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: null,
    },
  },
  setup(props) {
    return () => (
      <div class="rank">
        <h4 class="title">{props.title}</h4>
        <ul class="list">
          {props.list.map((item, index) => (
            <li>
              <span class={index < 3 ? 'active' : null}>{index + 1}</span>
              <span>{item.name}</span>
              <span>{item.total}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  },
})