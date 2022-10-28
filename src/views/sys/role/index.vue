<template>
  <div class="container">
    <Breadcrumb />
    <a-card class="general-card">
      <a-row class="py-16px">
        <a-col :span="16">
          <a-space>
            <a-button type="primary">
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
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="角色名称" data-index="roleName" />
          <a-table-column title="创建时间" data-index="createTime" />
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <div v-if="record.status === 'Y'">
                <span class="circle"></span>已启用
              </div>
              <div v-else> <span class="circle pass"></span>已禁用 </div>
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="operations">
            <template #cell>
              <a-button type="text" size="small"> 编辑 </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:visible="visible" title="新建&编辑角色" :footer="false">
      <a-form
        ref="formRef"
        :rules="formRules"
        :model="formModel"
        @submit="handleSubmit"
      >
        <a-form-item field="roleName" label="角色名称">
          <a-input v-model="formModel.roleName" />
        </a-form-item>
        <a-form-item field="post" label="状态">
          <a-select v-model="formModel.status">
            <a-option value="post1">Post1</a-option>
            <a-option value="post2">Post2</a-option>
            <a-option value="post3">Post3</a-option>
            <a-option value="post4">Post4</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button html-type="submit">提交</a-button>
            <a-button>取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import useLoading from '@/hooks/loading';
  import { getRolePage } from '@/api/role';
  import { Pagination } from '@/types/global';

  const generateFormModel = () => {
    return {
      roleName: '',
      status: '',
      funcIds: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const formModel = ref(generateFormModel());
  const visible = ref(true);
  const formRef = ref();
  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const formRules = ref({
    roleName: { required: true, message: '角色名称不能为空' },
  });

  const handleSubmit = () => {
    formRef.value.validate(() => {});
  };

  const fetchData = async (params: any = { startPage: 1, pageSize: 20 }) => {
    setLoading(true);
    try {
      const data: any = await getRolePage(params);
      renderData.value = data.retData;
      pagination.total = data.totalNum;
    } finally {
      setLoading(false);
    }
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
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
