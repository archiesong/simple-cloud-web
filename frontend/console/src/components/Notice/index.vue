<script lang="ts" setup>
const count = ref(0)
const loading = ref(false)
</script>
<template>
  <a-dropdown placement="bottomRight" :trigger="['click']" overlayClassName="header-notice-wrapper">
    <template #overlay>
      <a-menu>
        <a-spin :spinning="loading">
          <a-tabs centered>
            <a-tab-pane :tab="$t('global.notice')" :key="1">
              <div>
                <a-list />
                <div class="bottomBar">
                  <div>{{ $t('global.empty.notice') }}</div>
                  <div>{{ $t('global.see.more') }}</div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('global.message')" :key="2">
              <div>
                <a-list />
                <div class="bottomBar">
                  <div>{{ $t('global.empty.message') }}</div>
                  <div>{{ $t('global.see.more') }}</div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('global.todo')" :key="3">
              <div>
                <a-list />
                <div class="bottomBar">
                  <div>{{ $t('global.empty.message') }}</div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </a-menu>
    </template>
    <span class="ant-pro-dropdown">
      <a-badge :count="count" :style="{ boxShadow: 'none' }">
        <BellOutlined
          :style="{
            padding: '4px',
            verticalAlign: 'middle',
          }"
        />
      </a-badge>
    </span>
  </a-dropdown>
</template>
<style lang="less" scoped>
.header-notice-wrapper {
  .ant-dropdown-content {
    .ant-dropdown-menu {
      padding: 0;
      width: 336px;
      border-radius: 4px;
      box-shadow:
        0 6px 16px -8px rgb(0 0 0 / 8%),
        0 9px 28px 0 rgb(0 0 0 / 5%),
        0 12px 48px 16px rgb(0 0 0 / 3%);
    }
  }

  .bottomBar {
    height: 46px;
    line-height: 46px;
    text-align: center;
    // border-top: 1px solid @border-color-split;
    border-radius: 0 0 2px 2px;
    transition: all 0.3s;

    div {
      display: inline-block;
      width: 50%;
      cursor: pointer;
      transition: all 0.3s;
      user-select: none;

      &:not(:only-child):last-child {
        // border-left: 1px solid @border-color-split;
      }
    }
  }
}
</style>