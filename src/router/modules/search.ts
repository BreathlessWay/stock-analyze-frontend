import { RouteRecordRaw } from 'vue-router';
import { Layout, ParentLayout } from '@/router/constant';
import { WalletOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'data';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/data',
    name: routeName,
    component: Layout,
    redirect: '/data/analyze/search',
    meta: {
      title: '数据可视化',
      icon: renderIcon(WalletOutlined),
      sort: 8,
    },
    children: [
      {
        path: 'analyze',
        name: `${routeName}_table`,
        redirect: '/data/analyze/search',
        component: ParentLayout,
        meta: {
          title: '数据可视化',
        },
        children: [
          {
            path: 'search',
            name: `${routeName}_table_basic`,
            meta: {
              title: '分析页',
            },
            component: () => import('@/views/comp/table/basic.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;
