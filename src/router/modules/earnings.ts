import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { FundOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'earnings';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/earnings',
    name: routeName,
    component: Layout,
    redirect: '/earnings/analyze',
    meta: {
      title: '数据统计',
      icon: renderIcon(FundOutlined),
      sort: 8,
    },
    children: [
      {
        path: 'analyze',
        name: `${routeName}_upload`,
        meta: {
          title: '收益分析',
        },
        component: () => import('@/views/earnings/analyze/index.vue'),
      },
    ],
  },
];

export default routes;
