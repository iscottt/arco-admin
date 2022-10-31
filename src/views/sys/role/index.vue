<template>
  <div class="s-container">
    <Breadcrumb />
    <a-card class="general-card">
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
        row-key="roleId"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :columns="columns"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #status="{ record }">
          <div v-if="record.status === 'Y'">
            <span class="circle"></span>已启用
          </div>
          <div v-else> <span class="circle pass"></span>已停用 </div>
        </template>
        <template #actions="{ record }">
          <a-button type="text" size="small" @click="handleEdit(record)">
            编辑
          </a-button>
          <!-- <a-popconfirm
                content="是否确认删除该数据？"
                @ok="handleDelete(record.roleId)"
              >
                <a-button type="text" status="danger" size="small">
                  删除
                </a-button>
              </a-popconfirm> -->
        </template>
      </a-table>
    </a-card>
    <!-- 新增&编辑弹窗 -->
    <a-modal
      v-model:visible="visible"
      title="新建&编辑角色"
      @before-ok="handleBeforeOk"
    >
      <div class="modal-container">
        <a-form ref="formRef" :rules="formRules" :model="formModel">
          <a-form-item field="roleName" label="角色名称">
            <a-input v-model="formModel.roleName" />
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-radio-group v-model="formModel.status">
              <a-radio value="Y">启用</a-radio>
              <a-radio value="N">停用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item field="funcIds" label="角色">
            <a-spin :loading="treeData.length < 1">
              <a-tree
                v-if="treeData.length > 0"
                :checkable="true"
                :blockNode="true"
                :show-line="true"
                checkedStrategy="child"
                v-model:checked-keys="formModel.funcIds"
                :data="treeData"
              />
            </a-spin>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { getRolePage, getRoleTree } from '@/api/role';
  import { Pagination } from '@/types/global';
  import { insertRole, updateRole, deleteRole } from '@/api/role';
  import { columns } from './columns.role';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import { filterParams } from '@/utils/business';

  // 初始化表单
  const generateFormModel = () => {
    return {
      roleName: '',
      status: 'Y',
      funcIds: [],
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const formModel = ref(generateFormModel());
  const visible = ref(false);
  const formRef = ref();
  const treeData = ref([]);
  const modalType = ref<'add' | 'edit'>('add');

  /**
   * 清除表单
   */
  const clearForm = () => {
    treeData.value = [];
    formRef.value.resetFields();
    formRef.value.clearValidate();
  };
  /**
   * 新增角色
   */
  const handleAdd = async () => {
    visible.value = true;
    modalType.value = 'add';
    clearForm();
    await getTreeData();
  };
  /**
   * 编辑角色
   */
  const handleEdit = async (record) => {
    visible.value = true;
    modalType.value = 'edit';
    clearForm();
    await getTreeData();
    const filterRes = filterfields(record);
    // filterRes.funcIds = filterRes.funcList;
    // delete filterRes.funcList;
    formModel.value = filterRes;
  };
  /**
   * 定义编辑接口需要提交的字段并且进行过滤
   * @param record
   */
  const filterfields = (record) => {
    const needFields = [
      'status',
      'roleId',
      'funcList',
      'roleName',
      'funcIds',
    ] as const;
    type roleEditProps = Record<typeof needFields[number], any>;
    return filterParams<roleEditProps>(needFields, cloneDeep(record), [
      { funcList: 'funcIds' },
    ]);
  };
  /**
   * 删除角色
   * @param id
   */
  // @ts-ignore
  const handleDelete = async (roleId: string) => {
    await deleteRole({ seqIds: roleId.toString() });
    Message.success('操作成功！');
    fetchData();
  };
  /**
   * 获取树数据
   */
  const getTreeData = async () => {
    treeData.value = [];
    const { data } = await getRoleTree();
    treeData.value = data;
  };

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
    roleName: { required: true, message: '角色名称不能为空' },
    funcIds: { required: true, message: '角色不能为空' },
  });
  /**
   * 表单提交
   */
  const handleBeforeOk = (done) => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        if (modalType.value === 'add') {
          await insertRole(formModel.value);
        } else {
          await updateRole(formModel.value);
        }
        visible.value = false;
        fetchData();
        Message.success('操作成功！');
        done();
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
      const data: any = await getRolePage(params);
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
    fetchData({ ...basePagination, startPage: current });
  };

  fetchData();
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
