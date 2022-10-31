<template>
  <a-config-provider :locale="zhCN">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
</script>
<style>
  .s-container {
    padding: 0 20px 20px 20px;
  }
</style>
