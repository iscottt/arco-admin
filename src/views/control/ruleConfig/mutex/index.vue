<template>
  <div class="p-20px">
    <a-row class="pt-4px">
      <a-col :flex="1">
        <a-form
          :model="searchForm"
          :label-col-props="{ span: 4 }"
          :wrapper-col-props="{ span: 20 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="源收费编码">
                <a-input
                  class="w-200px"
                  v-model="searchForm.keyWord"
                  placeholder="请输入源收费编码"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="源收费项目">
                <a-select
                  allow-search
                  v-model="searchForm.srcChargeCode"
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
            <a-col :span="24">
              <a-form-item label="互斥收费项目">
                <a-select
                  allow-search
                  v-model="searchForm.mutexChargeCode"
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
      :scroll="{ x: 800 }"
    >
      <template #limitTypeName="{ record }">
        <a-tag>{{ record.limitTypeName }}</a-tag>
      </template>
      <template #action="{ record }">
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
            <a-form-item field="chargeCode" label="源收费项目">
              <a-select
                allow-search
                v-model="formModel.srcChargeCode"
                placeholder="请选择"
                @search="handleSearch"
                :filter-option="false"
                @change="(e) => (formModel.chargeCode = e)"
              >
                <a-option v-for="item of unusedList" :value="item.chargeCode">{{
                  item.chargeName
                }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="源收费项目编码">
              <a-input :disabled="true" v-model="formModel.chargeCode" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="chargeCode" label="互斥收费项目">
              <a-select
                allow-search
                v-model="formModel.mutexChargeCode"
                placeholder="请选择"
                @search="handleSearch"
                :filter-option="false"
                @change="(e) => (formModel.chargeCodeUnused = e)"
              >
                <a-option v-for="item of unusedList" :value="item.chargeCode">{{
                  item.chargeName
                }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="formModel.mutexChargeCode">
            <a-form-item label="互斥收费项目编码">
              <a-input :disabled="true" v-model="formModel.chargeCodeUnused" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="limitType" label="限制类型">
              <a-select
                class="w-200px"
                v-model="formModel.limitType"
                :options="limitTypeOptions"
                placeholder="全部"
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
    deleteRuleMutex,
    getRuleMutexPage,
    insertRuleMutex,
    searchRuleMutex,
  } from '@/api/ruleConfig';
  import { Pagination } from '@/types/global';
  import { columns } from './column.mutex';
  import { IMutexSearch } from './interface';
  import { useSearchUnused, useVisible } from '@/hooks';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import { limitTypeOptions } from '../common';

  const searchForm = ref<Partial<IMutexSearch>>({});
  const formModel = ref<Partial<IMutexSearch>>({});
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const formRef = ref();
  const formRules = {
    limitType: { required: true, message: '限制类型' },
    chargeCode: { required: true, message: '不适用项目不能为空' },
    mutexChargeCode: { required: true, message: '不适用项目不能为空' },
  };
  /**
   * 表单提交
   * @param done
   */
  const handleBeforeOk = async (done) => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const params = cloneDeep({ ...formModel.value, ruleId: 1 });
        delete params.chargeCodeUnused;
        try {
          await insertRuleMutex(params);
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
      const data: any = await getRuleMutexPage(params);
      renderData.value = data.retData;
      pagination.total = data.totalNum;
    } finally {
      setLoading(false);
    }
  };
  /**
   * 查询
   */
  const search = async () => {
    if (JSON.stringify(searchForm.value) == '{}') return;
    setLoading(true);
    try {
      const data: any = await searchRuleMutex({
        startPage: basePagination.current,
        pageSize: basePagination.pageSize,
        ...searchForm.value,
      });
      renderData.value = data.retData;
      pagination.total = data.totalNum;
      pagination.current = 1;
    } finally {
      setLoading(false);
    }
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
   * 新建
   */
  const handleAdd = () => {
    formModel.value = {};
    formRef.value.clearValidate();
    formRef.value.resetFields();
    setVisible(true);
  };
  /**
   * 刷新
   */
  const reset = () => {
    searchForm.value = {};
    unusedList.value = [];
    formModel.value = {};
    formRef.value.clearValidate();
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
    await deleteRuleMutex({ seqIds: seqId.toString() });
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
