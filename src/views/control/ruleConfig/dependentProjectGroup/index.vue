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
            <a-col :span="12">
              <a-form-item label="限制类型">
                <a-select
                  v-model="searchForm.limitType"
                  :options="limitTypeOptions"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="状态">
                <a-select
                  allow-clear
                  v-model="searchForm.status"
                  :options="statusOptions"
                  placeholder="全部"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="收费项目"
                :label-col-props="{ span: 4 }"
                :wrapper-col-props="{ span: 18 }"
              >
                <a-select
                  allow-search
                  class="-ml-3px"
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
      row-key="groupId"
      :loading="loading"
      :pagination="pagination"
      :data="renderData"
      :bordered="false"
      @page-change="onPageChange"
      :columns="columns"
      :scroll="{ x: 800 }"
    >
      <template #status="{ record }">
        <a-tag color="green" v-if="record.status == 'Y'">生效</a-tag>
        <a-tag v-if="record.status == 'N'">失效</a-tag>
      </template>
      <template #limitType="{ record }">
        <a-tag v-if="record.limitType == '1'">当天</a-tag>
        <a-tag v-else>当次就诊</a-tag>
      </template>
      <template #action="{ record }">
        <a-button type="text" size="small" @click="handleEdit(record)">
          编辑
        </a-button>
        <a-popconfirm
          content="是否确认删除该数据？"
          @ok="handleDelete(record.groupId)"
        >
          <a-button type="text" status="danger" size="small"> 删除 </a-button>
        </a-popconfirm>
        <a-button type="text" size="small" @click="handleDraw(record.groupId)">
          查看详情
        </a-button>
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
            <a-form-item field="srcChargeCode" label="收费项目">
              <a-select
                allow-search
                v-model="formModel.srcChargeCode"
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
    <!-- 详情 -->
    <a-drawer
      width="900px"
      :visible="visibleDrawer"
      unmountOnClose
      @cancel="visibleDrawer = false"
      @ok="visibleDrawer = false"
    >
      <template #title> 查看详情 </template>
      <GroupDetail :groupId="+groupId" />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useLoading } from '@/hooks';
  import {
    getGroupPage,
    insertGroup,
    updateGroup,
    deleteGroup,
  } from '@/api/ruleConfig';
  import { Pagination } from '@/types/global';
  import { columns } from './column.group';
  import { IGroupSearch, IGroupEdit } from './interface';
  import { useSearchUnused, useVisible } from '@/hooks';
  import { Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import { filterParams } from '@/utils/business';
  import { limitTypeOptions, statusOptions } from '../common';
  import GroupDetail from './detail.vue';

  const searchForm = ref<Partial<IGroupSearch>>({});
  const formModel = ref<Partial<IGroupEdit>>({});
  const { visible, setVisible } = useVisible();
  const { loading, setLoading } = useLoading(true);
  const okLoading = ref<boolean>(false);
  const renderData = ref([]);
  const formRef = ref();
  const groupId = ref('');
  const modalType = ref<'add' | 'edit'>('add');
  const visibleDrawer = ref<boolean>(false);
  const formRules = {
    limitType: { required: true, message: '限制类型' },
    srcChargeCode: { required: true, message: '收费项目不能为空' },
    status: { required: true, message: '状态不能为空' },
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

  const handleDraw = (gid) => {
    groupId.value = gid;
    visibleDrawer.value = true;
  };

  /**
   * 表单提交
   * @param done
   */
  const handleBeforeOk = async (done) => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const params = cloneDeep({ ...formModel.value });
        try {
          if (modalType.value === 'add') {
            await insertGroup(params);
          } else {
            await updateGroup(params);
          }
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
      const data: any = await getGroupPage(params);
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
    formModel.value = {};
    formRef.value.clearValidate();
    formRef.value.resetFields();
    modalType.value = 'add';
    setVisible(true);
  };
  /**
   * 编辑
   * @param record
   */
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
    const needFields = [
      'groupId',
      'status',
      'limitType',
      'srcChargeCode',
    ] as const;
    return filterParams<IGroupEdit>(needFields, cloneDeep(record));
  };
  /**
   * 删除角色
   * @param id
   */
  const handleDelete = async (groupId: string) => {
    await deleteGroup({ seqIds: groupId.toString() });
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
