<template>
  <div class="s-container">
    <a-space direction="vertical" class="mt-2" size="large" fill>
      <a-descriptions :column="3" table-layout="fixed">
        <a-descriptions-item label="就诊类型">
          <a-tag v-if="taskInfo.patientType == '1'">住院</a-tag>
          <a-tag v-else-if="taskInfo.patientType == '2'">住院</a-tag>
          <span v-else>---</span>
        </a-descriptions-item>
        <a-descriptions-item label="规则大类">
          <a-tag>{{ taskInfo.ruleKindName }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="质控项目">
          <a-tag
            class="mr-1"
            :key="item"
            v-for="item of taskInfo.ruleNames?.split(',')"
            >{{ item }}</a-tag
          >
        </a-descriptions-item>
        <a-descriptions-item label="对象层级">
          <a-tag v-if="taskInfo.targetLevel == 1">全院</a-tag>
          <a-tag v-if="taskInfo.targetLevel == 2">院区</a-tag>
          <a-tag v-if="taskInfo.targetLevel == 3">病区</a-tag>
          <a-tag v-if="taskInfo.targetLevel == 4">科室</a-tag>
          <a-tag v-if="taskInfo.targetLevel == 5">医生</a-tag>
          <a-tag v-if="taskInfo.targetLevel == 6">病人</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="质控对象">
          <a-tag>{{ taskInfo.targetName }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="任务状态">
          <a-tag color="#87d068" v-if="taskInfo.taskStatus == 'U'">
            未处理
          </a-tag>
          <a-tag color="#87d068" v-if="taskInfo.taskStatus == 'P'">
            处理中
          </a-tag>
          <a-tag color="#87d068" v-if="taskInfo.taskStatus == 'F'">
            处理完成
          </a-tag>
          <a-tag color="#f50" v-if="taskInfo.taskStatus == 'E'">
            处理异常
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="质控患者数">
          <a-tag color="arcoblue">{{ taskInfo.targetCount || 0 }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="异常患者数">
          <a-tag color="arcoblue">{{
            taskInfo.outlierPatientCount || 0
          }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="异常收费数">
          <a-tag color="arcoblue">{{ taskInfo.outlierCount || 0 }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="任务结果说明">
          <a-tag>{{ taskInfo.remark }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-space>
    <a-divider class="my-0" />
    <a-row class="py-16px">
      <a-col :span="16">
        <a-space>
          <a-button type="primary">
            <template #icon>
              <icon-download />
            </template>
            导出Excel
          </a-button>
        </a-space>
      </a-col>
    </a-row>
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
      <template #action="{ record }">
        <a-popconfirm
          content="是否确认处理该任务？"
          @ok="handleDeal(record)"
          position="tr"
        >
          <a-button type="text" size="small"> 处理 </a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Message, TableData } from '@arco-design/web-vue';
  import { useLoading } from '@/hooks';
  import { Pagination } from '@/types/global';
  import { columns } from './column.detail';
  import { getTaskResultDetail, taskDeal } from '@/api/setControl';
  import { ITaskInfo } from './interface';
  import { getUserInfo } from '@/utils/auth';

  const props = defineProps<{ taskId: number }>();
  const { loading, setLoading } = useLoading();
  const taskInfo = ref<Partial<ITaskInfo>>({});
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
      const { retData } = (await getTaskResultDetail({
        ...params,
        taskId: props.taskId,
      })) as unknown as Http.IApiRes<ITaskInfo>;
      taskInfo.value = retData;
      renderData.value = retData.qcTaskResults;
      pagination.total = retData.qcTaskResults
        ? retData.qcTaskResults.length
        : 0;
    } finally {
      setLoading(false);
    }
  };

  const handleDeal = async (record) => {
    const params = {
      patientNo: record.patientNo,
      ruleId: record.ruleId,
      resultId: record.seqId,
      operatorId: getUserInfo().operatorId,
    };
    await taskDeal(params);
    Message.success('操作成功！');
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
    });
  };
  fetchData();
</script>

<style scoped lang="less"></style>
