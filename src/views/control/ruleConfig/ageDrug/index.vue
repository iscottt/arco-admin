<template>
  <div class="p-20px">
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
              <a-form-item label="年龄精度">
                <a-select
                  v-model="searchForm.dayYearFlag"
                  :options="ageOptions"
                  placeholder="全部"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="最小年龄">
                <a-input-number
                  v-model="searchForm.minAge"
                  placeholder="请输入最小年龄"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="最大年龄">
                <a-input-number
                  v-model="searchForm.maxAge"
                  placeholder="请输入最大年龄"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="适用项目"
                :label-col-props="{ span: 3 }"
                :wrapper-col-props="{ span: 18 }"
              >
                <a-select
                  allow-search
                  class="-ml-14px"
                  v-model="searchForm.chargeCode"
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
      row-key="roleId"
      :loading="loading"
      :pagination="pagination"
      :data="renderData"
      :bordered="false"
      @page-change="onPageChange"
      :columns="columns"
    >
      <template #age="{ record }">
        <a-tag>
          {{ record.age }}
        </a-tag>
      </template>
      <template #dayYearFlag="{ record }">
        <a-tag>
          {{ record.dayYearFlag == 'Y' ? '天数' : '年' }}
        </a-tag>
      </template>
      <template #action="{ record }">
        <a-popconfirm
          content="是否确认删除该数据？"
          position="tr"
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
            <a-form-item label="年龄精度" field="dayYearFlag">
              <a-select
                v-model="formModel.dayYearFlag"
                :options="ageOptions"
                placeholder="全部"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="最小年龄" field="minAge">
              <a-input-number
                v-model="formModel.minAge"
                placeholder="请输入最小年龄"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="最大年龄" field="maxAge">
              <a-input-number
                v-model="formModel.maxAge"
                placeholder="请输入最大年龄"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="chargeCode" label="适用项目代码">
              <a-select
                allow-search
                v-model="formModel.chargeCode"
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
    deleteDrugAge,
    getDrugAgePage,
    insertDrugAge,
  } from '@/api/ruleConfig';
  import { Pagination } from '@/types/global';
  import { columns } from './column.age';
  import { IAgeSearch } from './interface';
  import { useSearchUnused, useVisible } from '@/hooks';
  import { Message } from '@arco-design/web-vue';
  import { ageOptions } from '../common';

  const searchForm = ref<Partial<IAgeSearch>>({});
  const formModel = ref<Partial<IAgeSearch>>({});
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const formRef = ref();
  const formRules = {
    dayYearFlag: { required: true, message: '年龄精度不能为空' },
    maxAge: { required: true, message: '最大年龄不能为空' },
    minAge: { required: true, message: '最小年龄不能为空' },
    chargeCode: { required: true, message: '适用项目不能为空' },
  };
  /**
   * 表单提交
   * @param done
   */
  const handleBeforeOk = async () => {
    const errors = await formRef.value.validate();
    if (!errors) {
      try {
        await insertDrugAge({ ...formModel.value, ruleId: 12 });
      } catch (error) {
        return false;
      }
      Message.success('操作成功！');
      return reset();
    } else {
      return false;
    }
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
      const data: any = await getDrugAgePage(params);
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
    formModel.value = {};
    formRef.value.clearValidate();
    formRef.value.resetFields();
    setVisible(true);
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
    pagination.current = 1;
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
    await deleteDrugAge({ seqIds: seqId.toString() });
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

<style scoped lang="less"></style>
