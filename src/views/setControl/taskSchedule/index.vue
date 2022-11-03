<template>
  <div class="s-container">
    <Breadcrumb />
    <a-card>
      <a-row class="pt-4px">
        <a-col :flex="1">
          <a-form
            :model="searchForm"
            label-align="left"
            :label-col-props="{ span: 8 }"
            :wrapper-col-props="{ span: 16 }"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="规则大类">
                  <a-select
                    v-model="searchForm.chargeKind"
                    :options="kindList"
                    placeholder="请选择"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="对象层级">
                  <a-select
                    allow-clear
                    v-model="searchForm.targetLevel"
                    :options="targetLevelOpts"
                    placeholder="全部"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="任务状态">
                  <a-select
                    allow-clear
                    v-model="searchForm.taskStatus"
                    :options="taskScheduleStatusList"
                    placeholder="全部"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 42px" direction="vertical" />
        <a-col :flex="'180px'" style="text-align: right">
          <a-space :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-tooltip content="刷新将会清除搜索条件">
              <a-button @click="reset">
                <template #icon>
                  <icon-refresh />
                </template>
                刷新
              </a-button>
            </a-tooltip>
          </a-space>
        </a-col>
      </a-row>
      <a-divider class="my-0" />
      <a-row class="py-16px">
        <a-col :span="16">
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新建
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
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') || '---' }}
        </template>
        <template #taskStatus="{ record }">
          <a-tag color="#87d068" v-if="record.taskStatus == '1'">生效</a-tag>
          <a-tag color="#f50" v-else-if="record.taskStatus == '2'">失效</a-tag>
        </template>
        <template #isSchedule="{ record }">
          <a-tag color="#f50" v-if="record.isSchedule == '1'"
            >定时任务添加</a-tag
          >
          <a-tag color="#87d068" v-else>手工任务</a-tag>
        </template>
        <template #scheduleType="{ record }">
          <a-tag color="#abcdef" v-if="record.patientType == '1'">每月</a-tag>
          <a-tag color="#87d068" v-else>每日</a-tag>
        </template>
        <template #patientType="{ record }">
          <a-tag color="#abcdef" v-if="record.patientType == '1'">住院</a-tag>
          <a-tag color="#87d068" v-else>门诊</a-tag>
        </template>
        <template #targetLevel="{ record }">
          <a-tag v-if="record.targetLevel == '1'">全院</a-tag>
          <a-tag v-else-if="record.targetLevel == '2'">院区</a-tag>
          <a-tag v-else-if="record.targetLevel == '3'">病区</a-tag>
          <a-tag v-else-if="record.targetLevel == '4'">科室</a-tag>
          <a-tag v-else-if="record.targetLevel == '5'">医生</a-tag>
          <a-tag v-else-if="record.targetLevel == '6'">病人</a-tag>
        </template>
        <template #action="{ record }">
          <a-button type="text" size="small" @click="handleEdit(record)">
            编辑
          </a-button>
          <a-popconfirm
            content="是否确认删除该数据？"
            @ok="handleDelete(record.operatorId)"
          >
            <a-button type="text" status="danger" size="small"> 删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model:visible="visible"
      title="新建"
      title-align="start"
      @before-ok="handleBeforeOk"
    >
      <a-form
        :model="formModel"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="left"
        :rules="formRules"
        ref="formRef"
      >
        <a-row :gutter="16">
          <!-- 规则大类 -->
          <a-col :span="24">
            <a-form-item field="ruleKindId" label="规则大类">
              <a-select
                v-model="formModel.ruleKindId"
                :options="kindList"
                @change="getRuleList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 质控项目 -->
          <a-col :span="24">
            <a-form-item field="ruleIds" label="质控项目">
              <a-select
                v-model="formModel.ruleIds"
                :options="ruleList"
                multiple
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 就诊类型 -->
          <a-col :span="24">
            <a-form-item field="patientType" label="就诊类型">
              <a-select
                v-model="formModel.patientType"
                :options="patientTypeList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 对象层级 -->
          <a-col :span="24" v-if="formModel.patientType == '1'">
            <a-form-item field="targetLevel" label="对象层级">
              <a-select
                @change="targetLevelChange"
                v-model="formModel.targetLevel"
                :options="targetLevelOpts"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 动态展示 -->
          <a-col :span="24" v-if="formModel.targetLevel > 1">
            <a-form-item field="branchId" label="院区">
              <a-select
                v-model="formModel.branchId"
                :options="branchList"
                @change="initAreaList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="formModel.targetLevel > 2">
            <a-form-item field="areaId" label="病区">
              <a-select
                v-model="formModel.areaId"
                :options="areaList"
                @change="initDeptList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="formModel.targetLevel == 4">
            <a-form-item field="deptId" label="科室">
              <a-select
                v-model="formModel.deptId"
                :options="deptList"
                placeholder="请选择"
                @change="(deptId) => (formModel.targetId = deptId)"
              />
            </a-form-item>
          </a-col>
          <!-- 医生/患者 -->
          <a-col :span="24" v-if="formModel.targetLevel > 4">
            <a-form-item field="limitType" label="质控对象">
              <a-select
                allow-search
                v-model="formModel.targetId"
                placeholder="请选择"
                @search="handleSearch"
                :filter-option="false"
                :options="targetList"
              />
            </a-form-item>
          </a-col>
          <!-- 定时方式 -->
          <a-col :span="24">
            <a-form-item field="scheduleType" label="定时方式">
              <a-select
                v-model="formModel.scheduleType"
                :options="scheduleTypeList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 定时日期 -->
          <a-col :span="24">
            <a-form-item field="scheduleDay" label="定时日期">
              <a-input-number
                v-model="formModel.scheduleDay"
                placeholder="请填写1-31之间的数字"
              />
            </a-form-item>
          </a-col>
          <!-- 定时日期 -->
          <a-col :span="24">
            <a-form-item field="scheduleType" label="选择定时时间">
              <a-time-picker
                format="HH:mm"
                class="w-full"
                v-model="formModel.scheduleClock"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useLoading } from '@/hooks';
  import {
    getTaskSchedulePage,
    insertTaskSchedule,
    searchTaskSchedule,
    getRulekindList,
    getRuleListByKindId,
    getAreaList,
    getDeptList,
    searchDoctorList,
    searchPatientList,
  } from '@/api/setControl';
  import { Pagination } from '@/types/global';
  import { columns } from './column.task';
  import { ITaskSearch, ITaskEdit } from './interface';
  import { useVisible } from '@/hooks';
  import {
    FieldRule,
    Message,
    SelectOptionData,
    TableData,
  } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import {
    targetLevelOpts,
    taskScheduleStatusList,
    patientTypeList,
    scheduleTypeList,
  } from '../common';
  import dayjs from 'dayjs';
  import { filterToSelectOpt } from '@/utils/business';
  import { getTargetIdList } from '@/api/job-no';
  import { useSearchUser } from '../common';
  import { getUserInfo } from '@/utils/auth';

  const searchForm = ref<Partial<ITaskSearch>>({});
  const formModel = ref<Partial<ITaskEdit>>({});
  const formRef = ref();
  const renderData = ref<TableData[]>([]);
  const kindList = ref<SelectOptionData[]>([]);
  const ruleList = ref<SelectOptionData[]>([]);
  // 动态列表
  const branchList = ref<SelectOptionData[]>([]);
  const areaList = ref<SelectOptionData[]>([]);
  const deptList = ref<SelectOptionData[]>([]);
  const targetList = ref<SelectOptionData[]>([]);
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading(true);

  const formRules: Record<string, FieldRule | FieldRule[]> = {
    ruleKindId: { required: true, message: '规则大类不能为空' },
    ruleIds: { required: true, message: '质控项目不能为空' },
    patientType: { required: true, message: '就诊类型不能为空' },
    targetLevel: { required: true, message: '对象层级不能为空' },
    branchId: { required: true, message: '院区不能为空' },
    areaId: { required: true, message: '病区不能为空' },
    deptId: { required: true, message: '科室不能为空' },
    targetId: { required: true, message: '质控对象不能为空' },
  };
  // 初始化分页数据
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
    'show-total': true,
  });

  const targetLevelChange = () => {
    areaList.value = [];
    deptList.value = [];
    targetList.value = [];
    formModel.value.branchId = undefined;
    formModel.value.areaId = undefined;
    formModel.value.deptId = undefined;
    formModel.value.targetId = '';
  };
  /**
   * 搜索医生或患者
   * @param name
   */
  const handleSearch = async (name) => {
    let resourceData: unknown[];
    if (formModel.value.targetLevel == 5) {
      const { retData } = (await searchDoctorList({
        name,
      })) as unknown as Http.IApiRes<unknown[]>;
      resourceData = retData;
    } else {
      const { retData } = (await searchPatientList({
        name,
      })) as unknown as Http.IApiRes<unknown[]>;
      resourceData = retData;
    }
    targetList.value = useSearchUser(resourceData);
  };
  /**
   * 初始化规则大类
   */
  const initkindList = async () => {
    const { retData } = (await getRulekindList()) as unknown as Http.IApiRes<
      unknown[]
    >;
    kindList.value = filterToSelectOpt(retData, 'ruleKindId', 'ruleKindName');
    const { retData: branchRet } = (await getTargetIdList({
      targetLevel: 2,
    })) as any;
    branchList.value = filterToSelectOpt(branchRet, 'targetId', 'targetName');
  };
  /**
   * 根据branchId获取病区列表
   * @param branchId
   */
  const initAreaList = async (branchId) => {
    formModel.value.targetLevel < 5 && (formModel.value.targetId = branchId);
    const { retData } = (await getAreaList(
      branchId
    )) as unknown as Http.IApiRes<unknown[]>;
    areaList.value = filterToSelectOpt(retData, 'targetId', 'targetName');
  };
  /**
   * 根据areaId获取科室列表
   * @param areaId
   */
  const initDeptList = async (areaId) => {
    formModel.value.targetLevel < 5 && (formModel.value.targetId = areaId);
    const { retData } = (await getDeptList(areaId)) as unknown as Http.IApiRes<
      unknown[]
    >;
    deptList.value = filterToSelectOpt(retData, 'targetId', 'targetName');
  };
  /**
   * 根据规则大类获取质控项目
   * @param ruleKindId
   */
  const getRuleList = async (ruleKindId) => {
    const { retData } = (await getRuleListByKindId(
      ruleKindId
    )) as unknown as Http.IApiRes<unknown[]>;
    ruleList.value = filterToSelectOpt(retData, 'ruleId', 'ruleName');
  };
  /**
   * 表单提交
   * @param done
   */
  const handleBeforeOk = async (done) => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const params = cloneDeep({ ...formModel.value });
        params.operatorCode = getUserInfo().operatorId as string;
        try {
          await insertTaskSchedule(params);
        } catch (error) {
          return done(false);
        }
        setVisible(false);
        Message.success('操作成功！');
        reset();
        done();
      } else {
        done(false);
      }
    });
  };
  /**
   * 获取表格数据
   * @param params
   */
  const fetchData = async (params: any = { startPage: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const { retData, totalNum } = (await getTaskSchedulePage(
        params
      )) as unknown as Http.IApiRes<TableData[]>;
      renderData.value = retData;
      pagination.total = totalNum;
    } finally {
      setLoading(false);
    }
  };
  /**
   * 查询
   */
  const search = async () => {
    if (JSON.stringify(searchForm.value) === '{}') return;
    setLoading(true);
    try {
      const { retData, totalNum } = (await searchTaskSchedule({
        startPage: basePagination.current,
        pageSize: basePagination.pageSize,
        ...searchForm.value,
      })) as unknown as Http.IApiRes<TableData[]>;
      renderData.value = retData;
      pagination.total = totalNum;
      pagination.current = 1;
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    console.log('id', id);
  };
  const handleEdit = async (record) => {
    console.log('record', record);
  };
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
   * 刷新
   */
  const reset = () => {
    searchForm.value = {};
    formModel.value = {};
    pagination.current = 1;
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
    });
  };
  /**
   * 新建
   */
  const handleAdd = () => {
    formRef.value.clearValidate();
    formRef.value.resetFields();
    formModel.value = {
      patientType: '1',
      scheduleType: '1',
      targetId: '',
    };
    setVisible(true);
  };
  fetchData();
  initkindList();
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .s-container {
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
