<template>
  <div class="s-container h-full">
    <Breadcrumb />
    <div class="flex view-content">
      <div class="left-side">
        <a-spin :loading="loading">
          <a-tree
            v-if="treeData.length > 0"
            :fieldNames="{
              key: 'configUrl',
            }"
            :data="treeData"
            :show-line="true"
            v-model:selected-keys="selectedKeys"
            @select="handleSelect"
          />
        </a-spin>
      </div>
      <div class="right-side ml-2 rounded-4px h-full bg-white">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getControlMenu } from '@/api/ruleMgr';
  import { useRouterPush } from '@/composables';
  import { useLoading } from '@/hooks';
  import { ref, computed } from 'vue';
  import { RouteLocationRaw, useRoute } from 'vue-router';
  import { toHump, toLine } from '@/utils/business';
  import { cloneDeep } from 'lodash';

  const treeData = ref([]);
  const { loading, setLoading } = useLoading();
  /**
   * 自动根据路由url渲染树的选中项
   */
  const selectedKeys = computed(() => {
    const route = useRoute();
    const target = toLine(route.fullPath.replace('ruleConfig', 'rule'));
    console.log('target', target);
    return [target];
  });
  /**
   * 初始化树数据
   */
  const initTreeData = async () => {
    setLoading(true);
    treeData.value = [];
    try {
      const { retData } = (await getControlMenu()) as any;
      treeData.value = retData;
    } finally {
      setLoading(false);
    }
  };
  /**
   * 树选中跳转路由
   * @param selectedList
   */
  const handleSelect = (selectedList) => {
    const { routerPush } = useRouterPush(false);
    const target = cloneDeep(selectedList)[0];
    let to: RouteLocationRaw;
    /**
     * 处理带下划线的url转为驼峰
     */
    if (target.indexOf('_') > -1) {
      to = toHump(target).replace('rule', 'ruleConfig');
    } else {
      to = selectedList[0].replace('rule', 'ruleConfig');
    }
    routerPush(to, false);
  };
  initTreeData();
</script>

<style scoped lang="less">
  .view-content {
    height: calc(100% - 40px);
  }
  .left-side {
    @apply bg-white w-220px p-2 box-border h-full rounded-4px;
  }
  .right-side {
    width: calc(100% - 220px);
  }
</style>
