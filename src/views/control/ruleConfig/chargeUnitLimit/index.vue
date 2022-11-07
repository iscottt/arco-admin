<template>
  <div class="p-20px">
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
              <a-form-item label="费用单位">
                <a-select
                  v-model="searchForm.chargeUnit"
                  :options="unitList"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="状态">
                <a-select
                  allow-clear
                  v-model="searchForm.status"
                  :options="statusOptions"
                  placeholder="全部"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="质控动作">
                <a-select
                  allow-clear
                  v-model="searchForm.actionType"
                  :options="actionTypeOptions"
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
      row-key="seqId"
      :loading="loading"
      :pagination="pagination"
      :data="renderData"
      :bordered="false"
      @page-change="onPageChange"
      :columns="columns"
      :scroll="{ x: 800 }"
    >
      <template #expChargeNames="{ record }">
        {{ record.expChargeNames || '---' }}
      </template>
      <template #chargeKindName="{ record }">
        <a-tag v-if="record.chargeKindName">{{ record.chargeKindName }}</a-tag>
        <span v-else>---</span>
      </template>
      <template #chargeUnitName="{ record }">
        <a-tag>{{ record.chargeUnitName }}</a-tag>
      </template>
      <template #status="{ record }">
        <a-tag color="green" v-if="record.status == 'Y'">生效</a-tag>
        <a-tag v-if="record.status == 'N'">失效</a-tag>
      </template>
      <template #actionTypeName="{ record }">
        <a-tag>{{ record.actionTypeName }}</a-tag>
      </template>
      <template #limitTypeName="{ record }">
        <a-tag>{{ record.limitTypeName }}</a-tag>
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
      :ok-loading="okLoading"
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
            <a-form-item label="费用归类">
              <a-select
                v-model="formModel.chargeKind"
                :options="kindList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="chargeUnit" label="费用单位">
              <a-select
                v-model="formModel.chargeUnit"
                :options="unitList"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="limitType" label="限制类型">
              <a-select
                v-model="formModel.limitType"
                :options="limitTypeOptions"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="limitCount" label="限制数量">
              <a-input-number
                v-model="formModel.limitCount"
                placeholder="请输入限制数量"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24" v-if="formModel.chargeKind">
            <a-form-item field="expChargeIds" label="例外收费项目">
              <a-select
                allow-search
                v-model="formModel.expChargeIds"
                placeholder="请选择"
                multiple
                @search="handleSearch"
                :filter-option="false"
              >
                <a-option
                  v-for="item of unusedList"
                  :value="item.chargeCode"
                  :key="item.chargeCode"
                  >{{ item.chargeName }}</a-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="actionType" label="质控动作">
              <a-select
                allow-clear
                v-model="formModel.actionType"
                :options="actionTypeOptions"
                placeholder="请选择"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item field="status" label="状态">
              <a-select
                allow-clear
                v-model="formModel.status"
                :options="statusOptions"
                placeholder="请选择"
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
    deleteUnitLimit,
    getUnitLimitPage,
    insertUnitLimit,
    searchUnitLimit,
    updateUnitLimit,
    getEnums,
  } from '@/api/ruleConfig';
  import { Pagination } from '@/types/global';
  import { columns } from './column.unitLimit';
  import { IUnitLimitSearch, IUnitLimitEdit } from './interface';
  import { useSearchUnused, useVisible } from '@/hooks';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import { filterParams, filterToSelectOpt } from '@/utils/business';
  import {
    limitTypeOptions,
    statusOptions,
    actionTypeOptions,
  } from '../common';

  const searchForm = ref<Partial<IUnitLimitSearch>>({});
  const formModel = ref<Partial<IUnitLimitEdit>>({});
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading(true);
  const okLoading = ref<boolean>(false);
  const renderData = ref([]);
  const formRef = ref();
  const modalType = ref<'add' | 'edit'>('add');
  const kindList = ref<any[]>([]);
  const unitList = ref<any[]>([]);
  const formRules = {
    limitType: { required: true, message: '限制类型' },
    chargeUnit: { required: true, message: '费用单位不能为空' },
    actionType: { required: true, message: '质控动作不能为空' },
    status: { required: true, message: '状态不能为空' },
    limitCount: { required: true, message: '限制数量不能为空' },
  };
  /**
   * 初始化收费大类列表
   */
  const getKindLimitList = async () => {
    const params = { paramCode: 'charge_kind' };
    const { retData } = (await getEnums(params)) as any;
    kindList.value = filterToSelectOpt(retData, 'paramValue', 'paramValueName');
    let data = { paramCode: 'charge_unit' };
    const { retData: unitRet } = (await getEnums(data)) as any;
    unitList.value = filterToSelectOpt(unitRet, 'paramValue', 'paramValueName');
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
   * 表单提交
   * @param done
   */
  const handleBeforeOk = async () => {
    const errors = await formRef.value.validate();
    if (!errors) {
      try {
        const params = cloneDeep(formModel.value);
        if (modalType.value === 'add') {
          const temp: any = [];
          params.expChargeIds.map((item) => {
            item = 'seqId@' + item;
            temp.push(item);
          });
          params.expChargeIds = temp;
          await insertUnitLimit(params);
        } else {
          const temp: any = [];
          params.expChargeIds.map((item) => {
            if (item.indexOf('@') > -1) {
              item = item.split('@')[1];
            }
            temp.push(item);
          });
          params.expChargeIds = temp;
          await updateUnitLimit(params);
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
      const data: any = await getUnitLimitPage(params);
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
    if (JSON.stringify(searchForm.value) === '{}') return;
    setLoading(true);
    try {
      const data: any = await searchUnitLimit({
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
  /**
   * 新建
   */
  const handleAdd = () => {
    formRef.value.clearValidate();
    formRef.value.resetFields();
    formModel.value = {};
    modalType.value = 'add';
    setVisible(true);
  };
  /**
   * 编辑
   * @param record
   */
  const handleEdit = async (record) => {
    modalType.value = 'edit';
    if (record.expChargeNames) {
      const expChargeIds = record.expChargeIds.split(',');
      const expChargeNames = record.expChargeNames.split(',');
      const resultArr: any = [];
      expChargeIds.map((v, i) => {
        const obj = {
          chargeCode: v,
          chargeName: expChargeNames[i],
        };
        resultArr.push(obj);
      });
      unusedList.value = resultArr;
    }
    const filterRes = filterfields(cloneDeep(record));
    filterRes.expChargeIds = filterRes.expChargeIds.split(',');
    formModel.value = filterRes;
    setVisible(true);
  };

  /**
   * 定义编辑接口需要提交的字段并且进行过滤
   * @param record
   */
  const filterfields = (record) => {
    const needFields = [
      'seqId',
      'status',
      'chargeKind',
      'actionType',
      'limitType',
      'expChargeIds',
      'limitCount',
      'chargeUnit',
    ] as const;
    return filterParams<IUnitLimitEdit>(needFields, cloneDeep(record));
  };
  /**
   * 删除角色
   * @param id
   */
  const handleDelete = async (seqId: string) => {
    await deleteUnitLimit({ seqIds: seqId.toString() });
    Message.success('操作成功！');
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
      ...searchForm.value,
    });
  };
  fetchData();
  getKindLimitList();
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
