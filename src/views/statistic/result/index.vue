<template>
  <div class="s-container">
    <Breadcrumb />
    <a-card>
      <a-row class="pt-4px">
        <a-col :flex="1">
          <a-form
            :model="searchForm"
            :label-col-props="{ span: 8 }"
            :wrapper-col-props="{ span: 15 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="timeType" label="筛选日期">
                  <a-select
                    v-model="searchForm.timeType"
                    placeholder="全部"
                    :options="dateTypeList"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="startTime" label="开始时间">
                  <a-date-picker
                    v-if="searchForm.timeType == 'D'"
                    class="w-full"
                    v-model="searchForm.beginTime"
                    placeholder="请选择开始时间"
                  />
                  <a-year-picker
                    v-if="searchForm.timeType == 'Y'"
                    class="w-full"
                    v-model="searchForm.beginTime"
                    placeholder="请选择开始时间"
                  />
                  <a-month-picker
                    v-if="searchForm.timeType == 'M'"
                    class="w-full"
                    v-model="searchForm.beginTime"
                    placeholder="请选择开始时间"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="endTime" label="结束时间">
                  <a-date-picker
                    v-if="searchForm.timeType == 'D'"
                    class="w-full"
                    v-model="searchForm.endTime"
                    placeholder="请选择结束时间"
                  />
                  <a-year-picker
                    v-if="searchForm.timeType == 'Y'"
                    class="w-full"
                    v-model="searchForm.endTime"
                    placeholder="请选择开始时间"
                  />
                  <a-month-picker
                    v-if="searchForm.timeType == 'M'"
                    class="w-full"
                    v-model="searchForm.endTime"
                    placeholder="请选择开始时间"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="timeType" label="规则层级">
                  <a-select
                    v-model="searchForm.selectType"
                    placeholder="请选择"
                    :options="ruleLevelList"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="timeType" label="统计层级">
                  <a-select
                    v-model="searchForm.hospitalType"
                    placeholder="请选择"
                    :options="statisticLevelList"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 42px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              统计
            </a-button>
            <a-button type="outline" @click="handleExport">
              <template #icon>
                <icon-download />
              </template>
              导出
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider class="mt-0" />
      <a-table
        v-if="showTable"
        row-key="operatorId"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        :columns="columns"
        @page-change="onPageChange"
        :scroll="{ x: 1000 }"
      >
        <template #actions="{ record }">
          <a-button type="text" size="small" @click="goDetail(record)">
            查看详情
          </a-button>
        </template>
      </a-table>
    </a-card>
    <a-drawer
      width="900px"
      :visible="visible"
      unmountOnClose
      @cancel="visible = false"
      @ok="visible = false"
    >
      <template #title> 质控结果详情 </template>
      <ResultDetail :queryInfo="resultInfo" />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useLoading, useVisible } from '@/hooks';
  import { Pagination } from '@/types/global';
  import { searchResultReport, exportResultReport } from '@/api/statistic';
  import { columns } from './column';
  import { ResultSearchProps } from './interface';
  import { dateTypeList, ruleLevelList, statisticLevelList } from '../common';
  import dayjs from 'dayjs';
  import ResultDetail from './detail.vue';
  import { Message } from '@arco-design/web-vue';
  const defaultTime = {
    beginTime: dayjs().subtract(6, 'days').format('YYYY-MM-DD'),
    endTime: dayjs().format('YYYY-MM-DD'),
  };

  const searchForm = ref<Partial<ResultSearchProps>>({
    ...defaultTime,
    timeType: 'D',
    selectType: '1',
    hospitalType: '1',
  });
  const renderData = ref([]);
  const { loading, setLoading } = useLoading(true);
  const { visible, setVisible } = useVisible(false);
  const resultInfo = ref({});
  const showTable = ref<boolean>(false);
  // 初始化分页
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
    'show-total': true,
  });

  const goDetail = (record) => {
    resultInfo.value = {
      timeType: searchForm.value.timeType,
      ruleId: record.ruleId,
      ruleKindId: record.ruleKindId,
      statDate: record.statDate,
      selectType: searchForm.value.selectType,
      hospitalType: searchForm.value.hospitalType,
      deptNo: record.deptNo,
    };
    setVisible(true);
  };
  /**
   * 按条件查询
   */
  const search = () => {
    if (JSON.stringify(searchForm.value) == '{}') return;
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...searchForm.value,
    });
  };
  /**
   * 导出
   */
  const handleExport = async () => {
    const loadingInstance = Message.loading('正在发起下载...');
    try {
      const result = await exportResultReport({
        ...searchForm.value,
        startPage: basePagination.current,
        pageSize: basePagination.pageSize,
      });
      var str = result.headers['content-disposition'];
      var name = str.split('=')[1].split('.')[0];
      var fileType = str.split('=')[1].split('.')[1];
      const blob = result.data;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e: any) => {
        const a = document.createElement('a');
        a.download = decodeURI(name) + '.' + fileType;
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    } catch (error) {
      Message.error(error as string);
    } finally {
      loadingInstance.close();
    }
  };
  /**
   * 获取表格数据
   * @param params
   */
  const fetchData = async (params: any = { startPage: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const data: any = await searchResultReport(params);
      renderData.value = data.retData;
      pagination.total = data.totalNum;
      showTable.value = true;
    } finally {
      setLoading(false);
    }
  };
  /**
   * 分页变化事件
   * @param startPage
   */
  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData({
      pageSize: basePagination.pageSize,
      startPage: current,
    });
  };

  search();
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .modal-container {
    @apply w-full h-400px overflow-y-auto;
  }
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>
