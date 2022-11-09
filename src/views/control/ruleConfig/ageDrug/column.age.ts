import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '年龄',
    slotName: 'age',
  },
  {
    title: '年龄精度',
    slotName: 'dayYearFlag',
  },
  {
    title: '适用项目代码',
    dataIndex: 'chargeCode',
  },
  {
    title: '适用项目名称',
    dataIndex: 'chargeName',
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 120,
  },
];
