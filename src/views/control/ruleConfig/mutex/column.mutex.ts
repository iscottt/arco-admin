import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '源收费编码',
    dataIndex: 'srcChargeCode',
    width: 150,
  },
  {
    title: '源收费项目',
    dataIndex: 'srcChargeName',
    width: 200,
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
  },
  {
    title: '互斥收费编码',
    dataIndex: 'mutexChargeCode',
    width: 150,
  },
  {
    title: '互斥收费项目',
    dataIndex: 'mutexChargeName',
    width: 150,
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
  },
  {
    title: '限制类型',
    slotName: 'limitTypeName',
    width: 90,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 90,
  },
];
