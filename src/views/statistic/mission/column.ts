import { TableColumnData } from '@arco-design/web-vue';

export const columns: TableColumnData[] = [
  {
    title: '收费大类',
    align: 'center',
    dataIndex: 'ruleKindName',
    width: 150,
  },
  {
    title: '统计时段',
    align: 'center',
    dataIndex: 'statDate',
    width: 120,
  },
  {
    title: '总任务数',
    align: 'center',
    dataIndex: 'totalTaskCnt',
    width: 120,
  },
  {
    title: ' 质控病人总数',
    align: 'center',
    dataIndex: 'totalPatientcnt',
    width: 150,
  },
  {
    title: '异常病人数',
    align: 'center',
    dataIndex: 'outlierPatientCnt',
    width: 120,
  },
  {
    title: '等待处理数',
    align: 'center',
    dataIndex: 'waitingCnt',
    width: 120,
  },
  {
    title: '处理中数',
    align: 'center',
    dataIndex: 'processingCnt',
    width: 120,
  },
  {
    title: '处理完成数',
    align: 'center',
    dataIndex: 'finishCnt',
    width: 120,
  },
  {
    title: '处理失败数',
    align: 'center',
    dataIndex: 'errorCnt',
    width: 120,
  },
];
