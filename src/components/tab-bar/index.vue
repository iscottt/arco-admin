<template>
  <div class="tab-bar-container">
    <a-affix ref="affixRef" :offset-top="offsetTop">
      <div class="tab-bar-box">
        <div class="tab-bar-scroll" ref="bsWrapper">
          <BetterScroll
            ref="bsScroll"
            :options="{ scrollX: true, scrollY: false }"
          >
            <div class="tags-wrap" ref="tabRef">
              <tab-item
                v-for="(tag, index) in tagList"
                :key="tag.fullPath"
                :index="index"
                :item-data="tag"
              />
            </div>
          </BetterScroll>
        </div>
        <div class="tag-bar-operation"></div>
      </div>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onUnmounted, nextTick } from 'vue';
  import { RouteLocationNormalized, useRoute } from 'vue-router';
  import {
    listenerRouteChange,
    removeRouteListener,
  } from '@/utils/route-listener';
  import { useAppStore, useTabBarStore } from '@/store';
  import tabItem from './tab-item.vue';
  import BetterScroll from '../better-scroll/index.vue';
  import { useElementBounding } from '@vueuse/core';
  const route = useRoute();

  const bsWrapper = ref<HTMLElement>();
  const { width: bsWrapperWidth, left: bsWrapperLeft } =
    useElementBounding(bsWrapper);

  const bsScroll = ref<Expose.BetterScroll>();
  // 获取当前激活的tab的clientX
  const tabRef = ref<HTMLElement>();

  async function getActiveTabClientX() {
    await nextTick();
    if (tabRef.value) {
      const elements = tabRef.value.children;
      let activeTabElement;
      for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (element.className.indexOf('link-activated') > -1) {
          activeTabElement = element;
        }
      }
      const { x, width } = activeTabElement.getBoundingClientRect();
      const clientX = x + width / 2;
      const currentX = clientX - bsWrapperLeft.value;
      const deltaX = currentX - bsWrapperWidth.value / 2;
      if (bsScroll.value) {
        const { maxScrollX, x: leftX } = bsScroll.value.instance;
        const rightX = maxScrollX - leftX;
        const update =
          deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);
        bsScroll.value?.instance.scrollBy(update, 0, 300);
      }
    }
  }

  const appStore = useAppStore();
  const tabBarStore = useTabBarStore();

  const affixRef = ref();
  const tagList = computed(() => {
    return tabBarStore.getTabList;
  });
  const offsetTop = computed(() => {
    return appStore.navbar ? 60 : 0;
  });

  watch(
    () => route.fullPath,
    () => {
      getActiveTabClientX();
    },
    {
      immediate: true,
    }
  );

  watch(
    () => appStore.navbar,
    () => {
      affixRef.value.updatePosition();
    }
  );
  listenerRouteChange((route: RouteLocationNormalized) => {
    if (
      !route.meta.noAffix &&
      !tagList.value.some((tag) => tag.fullPath === route.fullPath)
    ) {
      tabBarStore.updateTabList(route);
    }
  }, true);

  onUnmounted(() => {
    removeRouteListener();
  });
</script>

<style scoped lang="less">
  .tab-bar-container {
    position: relative;
    background-color: var(--color-bg-2);
    .tab-bar-box {
      display: flex;
      padding: 0 0 0 20px;
      background-color: var(--color-bg-2);
      border-bottom: 1px solid var(--color-border);
      .tab-bar-scroll {
        height: 32px;
        flex: 1;
        overflow: hidden;
        .tags-wrap {
          padding: 4px 0;
          height: 48px;
          white-space: nowrap;
          overflow-x: auto;

          :deep(.arco-tag) {
            display: inline-flex;
            align-items: center;
            margin-right: 6px;
            cursor: pointer;
            &:first-child {
              .arco-tag-close-btn {
                display: none;
              }
            }
          }
        }
      }
    }

    .tag-bar-operation {
      width: 100px;
      height: 32px;
    }
  }
</style>
