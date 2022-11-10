import { TableColumnData } from '@arco-design/web-vue';
export const detailColumns: TableColumnData[] = [
  {
    title: '组ID',
    dataIndex: 'groupId',
    width: 100,
  },

  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '互斥收费项目编号',
    dataIndex: 'mutexChargeCode',
    width: 150,
  },
  {
    title: '互斥收费项目名称',
    dataIndex: 'mutexChargeName',
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
    width: 150,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 160,
  },
];
