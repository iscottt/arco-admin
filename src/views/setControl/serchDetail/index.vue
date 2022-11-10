<template>
  <div class="s-container">
    <Breadcrumb />
    <a-card>
      <a-row class="pt-4px">
        <a-col :flex="1">
          <a-form
            :model="searchForm"
            :label-col-props="{ span: 8 }"
            :wrapper-col-props="{ span: 16 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="patientType" label="就诊类型">
                  <a-select
                    v-model="searchForm.patientType"
                    placeholder="全部"
                    :options="patientTypeList"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="dealStatus" label="处理状态">
                  <a-select
                    v-model="searchForm.dealStatus"
                    placeholder="全部"
                    :options="dealList"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="patientName" label="患者姓名">
                  <a-input
                    v-model="searchForm.patientName"
                    placeholder="请输入患者姓名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="bah" label="病案号">
                  <a-input
                    v-model="searchForm.bah"
                    placeholder="请输入病案号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="patientNo" label="住院号">
                  <a-input
                    v-model="searchForm.patientNo"
                    placeholder="请输入住院号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="qcRemark" label="内容检索">
                  <a-input
                    v-model="searchForm.qcRemark"
                    placeholder="请输入内容检索"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="startTime" label="开始时间">
                  <a-date-picker
                    class="w-full"
                    v-model="searchForm.startTime"
                    placeholder="请选择开始时间"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="endTime" label="结束时间">
                  <a-date-picker
                    class="w-full"
                    v-model="searchForm.endTime"
                    placeholder="请选择结束时间"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 134px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-tooltip content="刷新将会清除搜索条件" position="tr">
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                刷新
              </a-button>
            </a-tooltip>
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
        <template #dealStatus="{ record }">
          <a-tag v-if="record.dealStatus === 'Y'"> 已处理 </a-tag>
          <a-tag v-else>未处理 </a-tag>
        </template>
        <template #patientType="{ record }">
          <a-tag color="#abcdef" v-if="record.patientType == '1'">住院</a-tag>
          <a-tag color="#87d068" v-else>门诊</a-tag>
        </template>
        <template #actions="{ record }">
          <a-popconfirm
            position="tr"
            content="是否确认处理该任务？"
            @ok="handleDeal(record)"
          >
            <a-button type="text" size="small"> 处理 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useLoading } from '@/hooks';
  import { Pagination } from '@/types/global';
  import { searchTaskResult, taskDeal } from '@/api/setControl';
  import { columns } from './column.search';
  import { ResultSearchProps } from './interface';
  import { patientTypeList, dealList } from '../common';
  import dayjs from 'dayjs';
  import { getUserInfo } from '@/utils/auth';
  import { Message } from '@arco-design/web-vue';
  import { exportTaskResult } from '../../../api/setControl/result';
  const defaultTime = {
    startTime: dayjs().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };

  const searchForm = ref<Partial<ResultSearchProps>>({ ...defaultTime });
  const renderData = ref([]);
  const { loading, setLoading } = useLoading(true);
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
  /**
   * 处理结果
   * @param taskId
   */
  const handleDeal = async (record) => {
    const params = {
      patientNo: record.patientNo,
      ruleId: record.ruleId,
      resultId: record.seqId,
      operatorId: getUserInfo().operatorId,
    };
    await taskDeal(params);
    Message.success('操作成功！');
    search();
  };
  /**
   * 重置搜索条件
   */
  const reset = () => {
    searchForm.value = {
      ...defaultTime,
    };
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...defaultTime,
    });
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
  const handleExport = async () => {
    const loadingInstance = Message.loading('正在发起下载...');
    try {
      const result = await exportTaskResult({
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
      const data: any = await searchTaskResult(params);
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
