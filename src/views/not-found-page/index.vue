<template>
  <div class="content">
    <a-result class="pt-0" status="404" :subtitle="'找不到页面'"> </a-result>
    <div class="operation-row">
      <a-button key="back" type="primary" @click="back"> 返回 </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const back = () => {
    // warning： Go to the node that has the permission
    router.push('/dashboard/workplace');
  };
</script>

<style scoped lang="less">
  .content {
    @apply flex-center flex-col wh-full;
  }
</style>
