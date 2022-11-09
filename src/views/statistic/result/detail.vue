<template>
  <div class="s-container">
    <a-table
      row-key="taskId"
      :loading="loading"
      :pagination="pagination"
      :data="renderData"
      :bordered="false"
      @page-change="onPageChange"
      :columns="columns"
      :scroll="{ x: 800 }"
    >
      <template #dealStatus="{ record }">
        <a-tag color="green" v-if="record.dealStatus == 'Y'">已处理</a-tag>
        <a-tag v-if="record.dealStatus == 'N'">未处理</a-tag>
      </template>
      <template #actionType="{ record }">
        <a-tag color="#87d068" v-if="record.actionType == 1">质控</a-tag>
        <a-tag color="#87d068" v-else-if="record.actionType == 2">提醒</a-tag>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { TableData } from '@arco-design/web-vue';
  import { useLoading } from '@/hooks';
  import { Pagination } from '@/types/global';
  import { columns } from './column.detail';
  import { getTaskResultDetailByTime } from '@/api/statistic';

  const props = defineProps<{ queryInfo: any }>();
  const { loading, setLoading } = useLoading();
  const renderData = ref<TableData[]>([]);
  // 初始化分页数据
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
    'show-total': true,
  });
  /**
   * 翻页
   * @param current
   */
  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData({
      startPage: current,
      pageSize: basePagination.pageSize,
    });
  };
  /**
   * 获取表格数据
   * @param params
   */
  const fetchData = async (params: any = { startPage: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const { retData } = (await getTaskResultDetailByTime({
        ...params,
        ...props.queryInfo,
      })) as unknown as Http.IApiRes<any>;
      renderData.value = retData;
      pagination.total = retData.length;
    } finally {
      setLoading(false);
    }
  };

  fetchData();
</script>

<style scoped lang="less"></style>
