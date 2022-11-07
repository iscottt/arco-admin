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
                <a-form-item label="对象层级">
                  <a-select
                    allow-clear
                    v-model="searchForm.targetLevel"
                    :options="targetLevelOpts"
                    placeholder="全部"
                  />
                </a-form-item>
              </a-col>

              <!-- 院级账号才有查询权限 -->
              <template v-if="userInfo.operatorLevel == '1'">
                <!-- 院区 -->
                <a-col :span="8">
                  <a-form-item field="branchId" label="院区">
                    <a-input
                      v-if="userInfo.branchName"
                      :disabled="true"
                      v-model="userInfo.branchName"
                    />
                    <a-select
                      v-else
                      v-model="searchForm.branchId"
                      :options="branchList"
                      @change="initAreaList"
                      placeholder="请选择"
                    />
                  </a-form-item>
                </a-col>
                <!-- 病区 -->
                <a-col :span="8">
                  <a-form-item field="areaId" label="病区">
                    <a-input
                      v-if="userInfo.areaName"
                      :disabled="true"
                      v-model="userInfo.areaName"
                    />
                    <a-select
                      v-else
                      v-model="searchForm.areaId"
                      :options="areaList"
                      @change="initDeptList"
                      placeholder="请选择"
                    />
                  </a-form-item>
                </a-col>
              </template>
              <a-col :span="8">
                <a-form-item label="任务状态">
                  <a-select
                    allow-clear
                    v-model="searchForm.taskStatus"
                    :options="taskStatusOpts"
                    placeholder="全部"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="任务类型">
                  <a-select
                    v-model="searchForm.isSchedule"
                    :options="taskTypeList"
                    placeholder="请选择"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="质控结果">
                  <a-select
                    v-model="searchForm.resultType"
                    :options="resultTypeList"
                    placeholder="请选择"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="开始日期">
                  <a-date-picker
                    class="w-full"
                    v-model="searchForm.startTime"
                    placeholder="请选择"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="结束日期">
                  <a-date-picker
                    class="w-full"
                    v-model="searchForm.endTime"
                    placeholder="请选择"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 134px" direction="vertical" />
        <a-col :flex="'90px'" style="text-align: right">
          <a-space :size="18" direction="vertical">
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
        :scroll="{ x: 800, y: 330 }"
      >
        <template #createTime="{ record }">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') || '---' }}
        </template>
        <template #exeTime="{ record }">
          {{
            record.exeTime
              ? dayjs(record.exeTime).format('YYYY-MM-DD HH:mm:ss')
              : '---'
          }}
        </template>
        <template #finishTime="{ record }">
          {{
            record.finishTime
              ? dayjs(record.finishTime).format('YYYY-MM-DD HH:mm:ss')
              : '---'
          }}
        </template>
        <template #status="{ record }">
          <a-tag color="green" v-if="record.status == 'Y'">生效</a-tag>
          <a-tag v-if="record.status == 'N'">失效</a-tag>
        </template>
        <template #taskStatus="{ record }">
          <a-tag color="#87d068" v-if="record.taskStatus == 'U'">未处理</a-tag>
          <a-tag color="#87d068" v-else-if="record.taskStatus == 'P'"
            >处理中</a-tag
          >
          <a-tag color="#87d068" v-else-if="record.taskStatus == 'F'"
            >已处理</a-tag
          >
          <a-tag color="#f50" v-else-if="record.taskStatus == 'E'"
            >处理异常</a-tag
          >
        </template>
        <template #isSchedule="{ record }">
          <a-tag color="#f50" v-if="record.isSchedule == '1'">定时任务</a-tag>
          <a-tag color="#87d068" v-else>手工任务</a-tag>
        </template>
        <template #patientStatus="{ record }">
          <a-tag v-if="record.patientStatus == '1'">在院</a-tag>
          <a-tag color="#87d068" v-else-if="record.patientStatus == '2'"
            >离院</a-tag
          >
          <span v-else>---</span>
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
          <a-button type="text" size="small" @click="handleDraw(record)">
            查看详情
          </a-button>
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
          <!-- 病人类型 -->
          <a-col :span="24">
            <a-form-item field="patientStatus" label="病人类型">
              <a-select
                v-model="formModel.patientStatus"
                :options="patientStatusList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 对象层级 -->
          <a-col :span="24">
            <a-form-item field="targetLevel" label="对象层级">
              <a-select
                @change="targetLevelChange"
                v-model="formModel.targetLevel"
                :options="targetLevelOpts"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 院区 -->
          <a-col :span="24" v-if="formModel.targetLevel > 1">
            <a-form-item field="branchId" label="院区">
              <a-input
                v-if="userInfo.branchName"
                :disabled="true"
                v-model="userInfo.branchName"
              />
              <a-select
                v-else
                v-model="formModel.branchId"
                :options="branchList"
                @change="initAreaList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 病区 -->
          <a-col :span="24" v-if="formModel.targetLevel > 2">
            <a-form-item field="areaId" label="病区">
              <a-input
                v-if="userInfo.areaName"
                :disabled="true"
                v-model="userInfo.areaName"
              />
              <a-select
                v-else
                v-model="formModel.areaId"
                :options="areaList"
                @change="initDeptList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <!-- 科室 -->
          <a-col :span="24" v-if="formModel.targetLevel == 4">
            <a-form-item field="deptId" label="科室">
              <a-input
                v-if="userInfo.deptName"
                :disabled="true"
                v-model="userInfo.deptName"
              />
              <a-select
                v-else
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
          <!-- 开始结束时间 -->
          <template
            v-if="
              formModel.patientType == '2' || formModel.patientStatus == '2'
            "
          >
            <a-col :span="24">
              <a-form-item
                field="startTime"
                :label="
                  formModel.patientStatus == '1' ? '开始时间' : '离院开始时间'
                "
              >
                <a-date-picker
                  v-model="formModel.startTime"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                field="endTime"
                :label="
                  formModel.patientStatus == '1' ? '结束时间' : '离院结束时间'
                "
              >
                <a-date-picker
                  v-model="formModel.endTime"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </a-modal>
    <a-drawer
      width="900px"
      :visible="visibleDrawer"
      unmountOnClose
      @cancel="visibleDrawer = false"
      @ok="visibleDrawer = false"
    >
      <template #title> 任务详情 </template>
      <TaskDetail :taskId="taskId" />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useLoading } from '@/hooks';
  import TaskDetail from './detail.vue';
  import {
    getTaskPage,
    insertTask,
    searchTask,
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
    taskStatusOpts,
    patientStatusList,
    patientTypeList,
    resultTypeList,
    taskTypeList,
  } from '../common';
  import dayjs from 'dayjs';
  import { filterToSelectOpt } from '@/utils/business';
  import { getTargetIdList } from '@/api/job-no';
  import { useSearchUser } from '../common';
  import { getUserInfo } from '@/utils/auth';

  const userInfo = ref(getUserInfo());
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
  // 详情抽屉
  const visibleDrawer = ref<boolean>(false);
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading(true);
  const taskId = ref<number>(0);

  const formRules: Record<string, FieldRule | FieldRule[]> = {
    ruleKindId: { required: true, message: '规则大类不能为空' },
    ruleIds: { required: true, message: '质控项目不能为空' },
    patientStatus: { required: true, message: '病人类型不能为空' },
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
  const handleBeforeOk = async () => {
    formModel.value.branchId =
      userInfo.value.branchId ?? formModel.value.branchId;
    formModel.value.areaId = userInfo.value.areaId ?? formModel.value.areaId;
    formModel.value.deptId = userInfo.value.deptId ?? formModel.value.deptId;
    const errors = await formRef.value.validate();
    if (!errors) {
      const params = cloneDeep({ ...formModel.value });
      params.targetLevel == '4' && (params.targetId = params.deptId);
      params.operatorCode = userInfo.value.operatorId as string;
      try {
        await insertTask(params);
      } catch (error) {
        return false;
      }
      Message.success('操作成功！');
      return reset();
    } else {
      return false;
    }
  };
  /**
   * 获取表格数据
   * @param params
   */
  const fetchData = async (params: any = { startPage: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const { retData, totalNum } = (await getTaskPage(
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
      const { retData, totalNum } = (await searchTask({
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
  const handleDraw = (record) => {
    console.log('record', record);
    taskId.value = record.taskId;
    visibleDrawer.value = true;
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
      patientStatus: '1',
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

<style scoped lang="less"></style>
