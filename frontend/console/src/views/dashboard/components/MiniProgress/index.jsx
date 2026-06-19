import { Progress } from 'antdv-next'

import './index.less'
export default defineComponent({
  name: 'MiniProgress',
  props: {
    target: {
      type: Number,
      default: 0,
    },
    height: {
      type: String,
      default: '10px',
    },
    color: {
      type: String,
      default: '#13C2C2',
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    return () => (
      <div class="chart-mini-progress">
        {/* <div class="target" style={{ left: props.target + "%" }}>
          <span style={{ backgroundColor: props.color }} />
          <span style={{ backgroundColor: props.color }} />
        </div> */}
        <Progress
          percent={props.percentage}
          status="active"
          showInfo={false}
          strokeColor={{ from: '#108ee9', to: '#87d068' }}
          status="active"
        />
        {/* <div class="progress-wrapper">
          <div
            class="progress"
            style={{
              backgroundColor: props.color,
              width: props.percentage + "%",
              height: props.height,
            }}
          ></div>
        </div> */}
      </div>
    )
  },
})