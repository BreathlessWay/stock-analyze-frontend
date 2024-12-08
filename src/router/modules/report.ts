import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DownloadOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

const routeName = 'report';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/report',
    name: routeName,
    component: Layout,
    redirect: '/report/day',
    meta: {
      title: '数据下载',
      icon: renderIcon(DownloadOutlined),
      sort: 8,
    },
    children: [
      {
        path: 'day',
        name: `${routeName}_day`,
        meta: {
          title: '每日数据下载',
        },
        component: () => import('@/views/report/index.vue'),
      },
    ],
  },
];

export default routes;
