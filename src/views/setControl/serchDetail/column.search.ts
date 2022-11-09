import { TableColumnData } from '@arco-design/web-vue';

export const columns: TableColumnData[] = [
  {
    title: '就诊类型',
    slotName: 'patientType',
    width: 120,
  },
  {
    title: '病区名称',
    dataIndex: 'areaName',
    width: 120,
  },
  {
    title: '科室名称',
    dataIndex: 'departName',
    width: 120,
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName',
    width: 100,
  },
  {
    title: '病案号',
    dataIndex: 'bah',
    width: 120,
  },
  {
    title: '住院号',
    dataIndex: 'patientNo',
    width: 100,
  },
  {
    title: '规则名称',
    dataIndex: 'ruleName',
    width: 150,
  },
  {
    title: '收费时间',
    dataIndex: 'chargeDate',
    width: 180,
  },
  {
    title: '质控时间',
    dataIndex: 'createTimeString',
    width: 180,
  },
  {
    title: '处理状态',
    slotName: 'dealStatus',
    width: 120,
  },
  {
    title: '异常内容',
    dataIndex: 'qcRemark',
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
    width: 250,
  },
  {
    title: '操作',
    slotName: 'actions',
    align: 'center',
    fixed: 'right',
    width: 90,
  },
];
