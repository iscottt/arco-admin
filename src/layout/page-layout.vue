<template>
  <router-view v-slot="{ Component, route }" class="overflow-y-auto">
    <transition name="fade-slide" mode="out-in" appear>
      <component
        :is="Component"
        v-if="route.meta.ignoreCache"
        :key="route.fullPath"
      />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less">
  /* fade-slide */
  .fade-slide-leave-active,
  .fade-slide-enter-active {
    transition: all 0.3s;
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
