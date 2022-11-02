<template>
  <div class="p-20px">
    <a-row class="pt-4px">
      <a-col :flex="1">
        <a-form
          :model="searchForm"
          :label-col-props="{ span: 5 }"
          :wrapper-col-props="{ span: 19 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="性别">
                <a-select
                  class="w-200px"
                  v-model="searchForm.sexId"
                  :options="sexOptions"
                  placeholder="全部"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="不适用项目代码">
                <a-select
                  allow-search
                  v-model="searchForm.drugCode"
                  placeholder="请选择"
                  @search="handleSearch"
                  :filter-option="false"
                >
                  <a-option
                    v-for="item of unusedList"
                    :value="item.chargeCode"
                    >{{ item.chargeCode + '-' + item.chargeName }}</a-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider style="height: 84px" direction="vertical" />
      <a-col :flex="'90px'" style="text-align: right">
        <a-space :size="18" direction="vertical">
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
      row-key="roleId"
      :loading="loading"
      :pagination="pagination"
      :data="renderData"
      :bordered="false"
      @page-change="onPageChange"
      :columns="columns"
    >
      <template #status="{ record }">
        <a-tag color="green" v-if="record.status == 'Y'">生效</a-tag>
        <a-tag v-if="record.status == 'N'">失效</a-tag>
      </template>
      <template #sexId="{ record }">
        <a-tag v-if="record.sexId == '1'" color="pinkpurple">男</a-tag>
        <a-tag v-else-if="record.sexId == '2'" color="green">女</a-tag>
        <span v-else>---</span>
      </template>
      <template #action="{ record }">
        <a-button type="text" size="small" @click="handleEdit(record)">
          编辑
        </a-button>
        <a-popconfirm
          content="是否确认删除该数据？"
          @ok="handleDelete(record.seqId)"
        >
          <a-button type="text" status="danger" size="small"> 删除 </a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visible"
      title="新建"
      title-align="start"
      width="700px"
      @before-ok="handleBeforeOk"
    >
      <a-form
        :model="formModel"
        :label-col-props="{ span: 5 }"
        :wrapper-col-props="{ span: 19 }"
        label-align="left"
        :rules="formRules"
        ref="formRef"
      >
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item field="sexId" label="性别">
              <a-select
                v-model="formModel.sexId"
                :options="sexOptions"
                placeholder="全部"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="status" label="状态">
              <a-select
                v-model="formModel.status"
                :options="statusOptions"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="drugCode" label="不适用项目代码">
              <a-select
                allow-search
                v-model="formModel.drugCode"
                placeholder="请选择"
                @search="handleSearch"
                :filter-option="false"
              >
                <a-option v-for="item of unusedList" :value="item.chargeCode">{{
                  item.chargeCode + '-' + item.chargeName
                }}</a-option>
              </a-select>
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
    deleteDrugSex,
    getDrugSexPage,
    insertDrugSex,
    updateDrugSex,
  } from '@/api/ruleConfig';
  import { Pagination } from '@/types/global';
  import { columns } from './column.sex';
  import { ISexSearch, IRuleSexEdit } from './interface';
  import { useSearchUnused, useVisible } from '@/hooks';
  import { Message } from '@arco-design/web-vue';
  import { sexOptions, statusOptions } from '../common';
  import { cloneDeep } from 'lodash';
  import { filterParams } from '@/utils/business';

  const searchForm = ref<Partial<ISexSearch>>({});
  const formModel = ref<Partial<ISexSearch>>({
    sexId: '1',
    status: 'Y',
  });
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const formRef = ref();
  const modalType = ref<'add' | 'edit'>('add');
  const formRules = {
    sexId: { required: true, message: '性别不能为空' },
    drugCode: { required: true, message: '不适用项目不能为空' },
    status: { required: true, message: '状态不能为空' },
  };
  /**
   * 表单提交
   * @param done
   */
  const handleBeforeOk = async (done) => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const params = { ...formModel.value };
        try {
          if (modalType.value === 'add') {
            await insertDrugSex(params);
          } else {
            await updateDrugSex(params);
          }
        } catch (error) {
          return done(false);
        }
        setVisible(false);
        reset();
        Message.success('操作成功！');
        done();
      }
    });
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
  /**
   * 状态list
   */
  const { unusedList, setUnusedList } = useSearchUnused();
  const handleSearch = (name) => {
    setUnusedList(name);
  };
  /**
   * 获取表格数据
   * @param params
   */
  const fetchData = async (params: any = { startPage: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const data: any = await getDrugSexPage(params);
      renderData.value = data.retData;
      pagination.total = data.totalNum;
    } finally {
      setLoading(false);
    }
  };
  /**
   * 新建
   */
  const handleAdd = () => {
    modalType.value = 'add';
    formModel.value = {};
    formRef.value.clearValidate();
    formRef.value.resetFields();
    setVisible(true);
  };
  const handleEdit = async (record) => {
    modalType.value = 'edit';
    await setUnusedList(record.srcChargeName);
    const filterRes = filterfields(cloneDeep(record));
    formModel.value = filterRes;
    setVisible(true);
  };
  /**
   * 定义编辑接口需要提交的字段并且进行过滤
   * @param record
   */
  const filterfields = (record) => {
    const needFields = ['drugCode', 'status', 'sexId', 'seqId'] as const;
    return filterParams<IRuleSexEdit>(needFields, cloneDeep(record));
  };
  /**
   * 查询
   */
  const search = async () => {
    if (JSON.stringify(searchForm.value) == '{}') return;
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...searchForm.value,
    });
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
    unusedList.value = [];
    formModel.value = {};
    pagination.current = 1;
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
    });
  };

  /**
   * 删除角色
   * @param id
   */
  const handleDelete = async (seqId: string) => {
    await deleteDrugSex({ seqIds: seqId.toString() });
    Message.success('操作成功！');
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...searchForm.value,
    });
  };
  fetchData();
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
