import { TableColumnData } from '@arco-design/web-vue';
export const columns: TableColumnData[] = [
  {
    title: '收费项目',
    dataIndex: 'chargeName',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '互斥医保大类',
    dataIndex: 'ybChargeKind',
    width: 120,
  },
  {
    title: '例外的收费项目',
    dataIndex: 'expChargeNames',
    ellipsis: true,
    tooltip: true,
    width: 200,
  },
  {
    title: '限制类型',
    slotName: 'limitType',
    width: 100,
  },
  {
    title: '状态',
    slotName: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '更新时间',
    dataIndex: 'statusTime',
    width: 180,
  },
  {
    title: '操作',
    slotName: 'action',
    align: 'center',
    fixed: 'right',
    width: 160,
  },
];
