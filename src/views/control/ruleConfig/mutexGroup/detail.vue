<template>
  <div>
    <a-row class="pt-4px">
      <a-col :flex="1">
        <a-form
          :model="searchForm"
          label-align="left"
          :label-col-props="{ span: 8 }"
          :wrapper-col-props="{ span: 16 }"
        >
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item
                label="收费项目"
                :label-col-props="{ span: 4 }"
                :wrapper-col-props="{ span: 18 }"
              >
                <a-select
                  allow-search
                  class="-ml-3px"
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
      <a-divider style="height: 42px" direction="vertical" />
      <a-col :flex="'180px'" style="text-align: right">
        <a-space :size="18">
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
      row-key="seqId"
      :loading="detailTableLoading"
      :data="detailTableData"
      :columns="detailColumns"
      :scroll="{ x: 800 }"
      :pagination="pagination"
      @page-change="onPageChange"
    >
      <template #action="{ record }">
        <a-button type="text" size="small" @click="handleEdit(record)">
          编辑
        </a-button>
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
            <a-form-item field="mutexChargeCode" label="收费项目">
              <a-select
                allow-search
                v-model="formModel.mutexChargeCode"
                placeholder="请选择"
                @search="handleSearch"
                :filter-option="false"
              >
                <a-option
                  v-for="item of unusedList"
                  :value="item.chargeCode"
                  v-bind:key="item.chargeCode"
                  >{{ item.chargeName }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { detailColumns } from './column.detail';
  import {
    searchGroupDtl,
    addGroupDtl,
    updateGroupDtl,
    deleteGroupDtl,
  } from '@/api/ruleConfig';
  import { reactive, ref } from 'vue';
  import { useSearchUnused, useVisible } from '@/hooks';
  import { cloneDeep } from 'lodash';
  import { Message } from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import { filterParams } from '@/utils/business';
  import { IGroupDetailEdit } from './interface';
  const searchForm = ref<{ mutexChargeCode?: string }>({});
  const detailTableLoading = ref<boolean>(false);
  const detailTableData = ref([]);
  const formRef = ref();
  const modalType = ref<'add' | 'edit'>('add');
  const { visible, setVisible } = useVisible();
  const formModel = ref<{ mutexChargeCode?: string }>({});
  const props = defineProps<{
    groupId: number;
  }>();
  // 初始化分页数据
  const basePagination: Pagination = {
    current: 1,
    pageSize: 7,
  };
  const pagination = reactive({
    ...basePagination,
    'show-total': true,
  });

  const formRules = {
    mutexChargeCode: { required: true, message: '收费项目不能为空' },
  };
  /**
   * 提交表单
   * @param done
   */
  const handleBeforeOk = async () => {
    const errors = await formRef.value.validate();
    if (!errors) {
      const params = cloneDeep({
        ...formModel.value,
        groupId: props.groupId,
      });
      try {
        if (modalType.value === 'add') {
          await addGroupDtl(params);
        } else {
          await updateGroupDtl(params);
        }
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

  const fetchData = async (params: any = { startPage: 1, pageSize: 10 }) => {
    detailTableLoading.value = true;
    try {
      const data: any = await searchGroupDtl({
        ...params,
        groupId: props.groupId,
      });
      detailTableData.value = data.retData;
      pagination.total = data.totalNum;
    } finally {
      detailTableLoading.value = false;
    }
  };
  /**
   * 编辑
   * @param record
   */
  const handleEdit = async (record) => {
    modalType.value = 'edit';
    const options = [
      {
        chargeCode: record.mutexChargeCode,
        chargeName: record.mutexChargeName,
      },
    ];
    const filterRes = filterFields(cloneDeep(record));
    unusedList.value = options;
    formModel.value = filterRes;
    setVisible(true);
  };
  /**
   * 定义编辑接口需要提交的字段并且进行过滤
   * @param record
   */
  const filterFields = (record) => {
    const needFields = ['mutexChargeCode', 'seqId', 'groupId'] as const;
    return filterParams<IGroupDetailEdit>(needFields, cloneDeep(record));
  };
  const handleDelete = async (seqId) => {
    await deleteGroupDtl({ seqId: seqId });
    Message.success('操作成功！');
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...searchForm.value,
    });
  };
  const handleAdd = () => {
    modalType.value = 'add';
    formModel.value = {};
    formRef.value.clearValidate();
    formRef.value.resetFields();
    setVisible(true);
  };
  /**
   * 状态list
   */
  const { unusedList, setUnusedList } = useSearchUnused();
  const handleSearch = (name) => {
    setUnusedList(name);
  };
  /**
   * 查询
   */
  const search = async () => {
    if (JSON.stringify(searchForm.value) === '{}') return;
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...searchForm.value,
    });
    pagination.current = 1;
  };
  /**
   * 刷新
   */
  const reset = () => {
    searchForm.value = {};
    formModel.value = {};
    unusedList.value = [];
    pagination.current = 1;
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
    });
  };
  fetchData();
</script>

<style scoped lang="less"></style>
