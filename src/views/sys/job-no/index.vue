<template>
  <div class="s-container">
    <Breadcrumb />
    <a-card>
      <a-row class="pt-4px">
        <a-col :flex="1">
          <a-form
            :model="searchForm"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="operatorName" label="姓名">
                  <a-input
                    v-model="searchForm.operatorName"
                    placeholder="请输入姓名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="phoneNumber" label="电话号">
                  <a-input
                    v-model="searchForm.phoneNumber"
                    placeholder="请输入电话号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="operatorCode" label="登录名">
                  <a-input
                    v-model="searchForm.operatorCode"
                    placeholder="请输入登录名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="roleId" label="角色">
                  <a-select
                    v-model="searchForm.operatorCode"
                    placeholder="请选择"
                    :options="roleOptions"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="blockStatus" label="锁定状态">
                  <a-radio-group v-model="searchForm.operatorCode">
                    <a-radio value="N">启用</a-radio>
                    <a-radio value="Y">禁用</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="operatorLevel" label="用户层级">
                  <a-select
                    v-model="searchForm.operatorLevel"
                    placeholder="请选择"
                    :options="levelList"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
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
        row-key="operatorId"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        :columns="columns"
        @page-change="onPageChange"
        :scroll="{ x: 1000 }"
      >
        <template #operatorLevel="{ record }">
          <a-tag v-if="record.operatorLevel == '1'">全院级</a-tag>
          <a-tag v-else-if="record.operatorLevel == '2'">分院级</a-tag>
          <a-tag v-else-if="record.operatorLevel == '3'">病区级</a-tag>
          <a-tag v-else-if="record.operatorLevel == '4'">科室级</a-tag>
        </template>
        <template #blockStatus="{ record }">
          <div v-if="record.blockStatus === 'N'">
            <span class="circle"></span>已启用
          </div>
          <div v-else> <span class="circle pass"></span>已停用 </div>
        </template>
        <template #roleList="{ record }">
          <a-tag v-for="item in record.roleList" :key="item.roleId">{{
            item.roleName
          }}</a-tag>
        </template>
        <template #actions="{ record }">
          <a-button type="text" size="small" @click="handleEdit(record)">
            编辑
          </a-button>
          <a-popconfirm
            content="是否确认删除该数据？"
            position="tr"
            @ok="handleDelete(record.operatorId)"
          >
            <a-button type="text" status="danger" size="small"> 删除 </a-button>
          </a-popconfirm>
          <a-button
            type="text"
            status="warning"
            size="small"
            @click="resetPwd(record.operatorId)"
          >
            修改密码
          </a-button>
        </template>
      </a-table>
    </a-card>
    <!-- 新增&编辑弹窗 -->
    <a-modal
      v-model:visible="visible"
      title="新建&编辑角色"
      title-align="start"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="formRef" :rules="formRules" :model="formModel">
        <a-form-item field="operatorCode" label="登录账号">
          <a-input v-model="formModel.operatorCode" />
        </a-form-item>
        <a-form-item
          field="password"
          label="登录密码"
          v-if="modalType === 'add'"
        >
          <a-input v-model="formModel.password" type="password" />
        </a-form-item>
        <a-form-item field="operatorName" label="用户名称">
          <a-input v-model="formModel.operatorName" />
        </a-form-item>
        <a-form-item field="phoneNumber" label="手机号">
          <a-input v-model="formModel.phoneNumber" />
        </a-form-item>
        <a-form-item field="roleList" label="角色">
          <a-select
            v-model="formModel.roleList"
            placeholder="请选择"
            multiple
            :options="roleOptions"
          />
        </a-form-item>
        <!-- operatorLevel -->
        <a-form-item field="operatorLevel" label="用户层级">
          <a-select
            v-model="formModel.operatorLevel"
            placeholder="请选择"
            :options="levelList"
          />
        </a-form-item>
        <a-form-item
          field="branchId"
          label="院区"
          v-if="formModel.operatorLevel > 1"
        >
          <a-select
            v-model="formModel.branchId"
            placeholder="请选择"
            :options="branchList"
            @change="branchChange"
          />
        </a-form-item>
        <a-form-item
          field="areaId"
          label="病区"
          v-if="formModel.operatorLevel > 2"
        >
          <a-select
            v-model="formModel.areaId"
            placeholder="请选择"
            :options="areaList"
            @change="areaChange"
          />
        </a-form-item>
        <a-form-item
          field="deptId"
          label="科室"
          v-if="formModel.operatorLevel > 3"
        >
          <a-select
            v-model="formModel.deptId"
            placeholder="请选择"
            :options="deptList"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, inject } from 'vue';
  import { useLoading } from '@/hooks';
  import { Pagination } from '@/types/global';
  import { selectRole } from '@/api/role';
  import {
    getJobNoPage,
    updateJobNo,
    getTargetIdList,
    getAreaList,
    getDeptList,
  } from '@/api/job-no';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import { filterParams, filterToSelectOpt } from '@/utils/business';
  import { insertJobNo, deleteJobNo } from '@/api/job-no';
  import { columns } from './columns.jobno';
  import { JobModalProps, JobSearchProps } from './interface';
  import { useVisible } from '@/hooks';

  const formModel = ref<Partial<JobModalProps> & { operatorLevel: number }>({
    operatorLevel: 1,
    blockStatus: 'N',
  });
  const searchForm = ref<Partial<JobSearchProps>>({});
  const renderData = ref([]);
  const formRef = ref();
  const modalType = ref<'add' | 'edit'>('add');
  const roleOptions = ref<any[]>([]);
  const { loading, setLoading } = useLoading(true);
  const { visible, setVisible } = useVisible();

  const levelList = ref([
    {
      value: 1,
      label: '全院级',
    },
    {
      value: 2,
      label: '分院级',
    },
    {
      value: 3,
      label: '病区级',
    },
    {
      value: 4,
      label: '科室级',
    },
  ]);
  const branchList = ref<any[]>([]);
  const areaList = ref<any[]>([]);
  const deptList = ref<any[]>([]);
  // 初始化分页
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
    'show-total': true,
  });
  // 初始化表单验证项
  const formRules = ref({
    operatorCode: { required: true, message: '登录账号不能为空' },
    password: { required: true, message: '登录密码不能为空' },
    operatorName: { required: true, message: '用户名称不能为空' },
    phoneNumber: { required: true, message: '手机号不能为空' },
    roleList: { required: true, message: '角色不能为空' },
    operatorLevel: { required: true, message: '用户层级不能为空' },
    branchId: { required: true, message: '院区不能为空' },
    areaId: { required: true, message: '病区不能为空' },
    deptId: { required: true, message: '科室不能为空' },
  });

  /**
   * 调用全局的修改密码组件
   */
  const togglePwd = inject('togglePwd');
  const resetPwd = (operatorId) => {
    (togglePwd as any)(operatorId);
  };
  /**
   * 重置搜索条件
   */
  const reset = () => {
    searchForm.value = {};
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
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
  /**
   * 初始化下拉框数据
   */
  const initSelectData = async () => {
    const { retData } = (await selectRole({
      startPage: 1,
      pageSize: 99,
    })) as any;
    roleOptions.value = filterToSelectOpt(retData, 'roleId', 'roleName');
    const { retData: branchRes } = (await getTargetIdList({
      targetLevel: 2,
    })) as any;
    branchList.value = filterToSelectOpt(branchRes, 'targetId', 'targetName');
  };
  /**
   * 选择院区下拉框获取病区列表
   * @param branchId
   */
  const branchChange = async (branchId) => {
    const { retData } = (await getAreaList({ branchId })) as any;
    areaList.value = filterToSelectOpt(retData, 'targetId', 'targetName');
  };
  /**
   * 选择病区下拉框获取科室列表
   * @param areaId
   */
  const areaChange = async (areaId) => {
    const { retData } = (await getDeptList({ areaId })) as any;
    deptList.value = filterToSelectOpt(retData, 'targetId', 'targetName');
  };
  /**
   * 清除表单
   */
  const clearForm = () => {
    areaList.value = [];
    deptList.value = [];
    formRef.value.resetFields();
    formRef.value.clearValidate();
  };
  /**
   * 新增角色
   */
  const handleAdd = async () => {
    setVisible(true);
    modalType.value = 'add';
    clearForm();
  };
  /**
   * 编辑角色
   */
  const handleEdit = async (record) => {
    modalType.value = 'edit';
    clearForm();
    const filterRes = filterfields(record);
    const result: any = [];
    filterRes.roleList.map((item) => {
      result.push(item.roleId);
    });
    filterRes.roleList = result;
    filterRes.branchId && (await branchChange(filterRes.branchId));
    filterRes.areaId && (await areaChange(filterRes.areaId));
    filterRes.operatorLevel = +filterRes.operatorLevel;
    formModel.value = filterRes;
    setVisible(true);
  };
  /**
   * 定义编辑接口需要提交的字段并且进行过滤
   * @param record
   */
  const filterfields = (record) => {
    const needFields = [
      'operatorCode',
      'operatorId',
      'operatorName',
      'password',
      'phoneNumber',
      'operatorLevel',
      'blockStatus',
      'roleList',
      'branchId',
      'deptId',
      'areaId',
    ] as const;
    type roleEditProps = Record<typeof needFields[number], any>;
    return filterParams<roleEditProps>(needFields, cloneDeep(record));
  };
  /**
   * 删除角色
   * @param id
   */
  const handleDelete = async (operatorId: string) => {
    await deleteJobNo({ seqIds: operatorId.toString() });
    Message.success('操作成功！');
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...searchForm.value,
    });
  };
  /**
   * 表单提交
   */
  const handleBeforeOk = async () => {
    const errors = await formRef.value.validate();
    if (!errors) {
      try {
        if (modalType.value === 'add') {
          await insertJobNo(formModel.value);
        } else {
          await updateJobNo(formModel.value);
        }
      } catch (error) {
        return false;
      }
      Message.success('操作成功！');
      return fetchData({
        startPage: basePagination.current,
        pageSize: basePagination.pageSize,
      });
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
      const data: any = await getJobNoPage(params);
      renderData.value = data.retData;
      pagination.total = data.totalNum;
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

  fetchData();
  initSelectData();
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
