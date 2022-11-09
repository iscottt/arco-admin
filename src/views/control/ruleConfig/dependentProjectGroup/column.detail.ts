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
    title: '依赖收费项目编号',
    dataIndex: 'dependChargeCode',
    width: 150,
  },
  {
    title: '依赖收费项目名称',
    dataIndex: 'dependChargeName',
    ellipsis: true,
    tooltip: {
      position: 'tr',
    },
    width: 200,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    width: 160,
  },
];
