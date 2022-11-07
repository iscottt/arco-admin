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
                <a-form-item label="规则名称">
                  <a-input
                    v-model="searchForm.ruleName"
                    placeholder="请输入规则名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="状态">
                  <a-select
                    v-model="searchForm.status"
                    :options="statusOptions"
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
      <a-table
        row-key="roleId"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
        :columns="columns"
        :scroll="{ x: 1000 }"
      >
        <template #status="{ record }">
          <a-popconfirm
            content="是否确认修改状态？"
            position="tr"
            @ok="switchStatus(record.status == 'Y', record.ruleId)"
          >
            <a-switch class="mx-2" :model-value="record.status == 'Y'">
              <template #checked> 在用 </template>
              <template #unchecked> 停用 </template>
            </a-switch>
          </a-popconfirm>
        </template>
        <template #actionType="{ record }">
          <a-tag v-if="record.actionType == '1'">质控</a-tag>
          <a-tag v-else-if="record.actionType == '2'">提醒</a-tag>
          <span v-else>---</span>
        </template>
        <template #statusDate="{ record }">
          {{ dayjs(record.statusDate).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useLoading } from '@/hooks';
  import { getRuleMgrPage, switchRuleStatus } from '@/api/ruleMgr';
  import { Pagination } from '@/types/global';
  import { columns } from './column.rule';
  import dayjs from 'dayjs';
  import { Message } from '@arco-design/web-vue';
  import { IRuleSearch } from './interface';

  const searchForm = ref<Partial<IRuleSearch>>({});
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);

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
  const statusOptions = computed(() => [
    {
      label: '在用',
      value: 'Y',
    },
    {
      label: '停用',
      value: 'N',
    },
  ]);
  /**
   * 获取表格数据
   * @param params
   */
  const fetchData = async (params: any = { startPage: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const data: any = await getRuleMgrPage(params);
      renderData.value = data.retData;
      pagination.total = data.totalNum;
    } finally {
      setLoading(false);
    }
  };
  /**
   * 查询
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
    fetchData({
      startPage: basePagination.current,
      pageSize: basePagination.pageSize,
    });
  };
  const switchStatus = async (isUnused, ruleId) => {
    const params = {
      status: isUnused ? 'N' : 'Y',
      ruleId,
    };
    await switchRuleStatus(params);
    Message.success('操作成功');
    reset();
  };
  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less"></style>
