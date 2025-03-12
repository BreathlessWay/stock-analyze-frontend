import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { useUser } from '@/store/modules/user';
import { storage } from '@/utils/Storage';
import { useGlobSetting } from '@/hooks/setting';
import { PageEnum } from '@/enums/pageEnum';
import { ResultEnum } from '@/enums/httpEnum';

const { apiUrl, urlPrefix } = useGlobSetting();

export const Alova = createAlova({
  baseURL: apiUrl,
  statesHook: VueHook,
  timeout: 1000000,
  // cacheLogger: process.env.NODE_ENV === 'development',
  cacheFor: 0 as any,
  requestAdapter: adapterFetch(),
  beforeRequest(method) {
    const userStore = useUser();
    const token = userStore.getToken;
    // 添加 token 到请求头
    if (!method.meta?.ignoreToken && token) {
      method.config.headers['token'] = token;
    }
    if (urlPrefix) {
      method.url = `${urlPrefix}${method.url}`;
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      const res = (response.json && (await response.json())) || response.body;
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res;
      }

      // 请根据自身情况修改数据结构
      const { message, statusCode, data } = res;

      // 不进行任何处理，直接返回
      // 用于需要直接获取 code、result、 message 这些信息时开启
      if (method.meta?.isTransformResponse === false) {
        return res.data;
      }

      // @ts-ignore
      const Message = window.$message;
      // @ts-ignore
      const Modal = window.$dialog;

      const LoginPath = PageEnum.BASE_LOGIN;
      if (ResultEnum.SUCCESS === statusCode) {
        return data;
      }
      // 需要登录
      if (statusCode === 401) {
        Modal?.warning({
          title: '提示',
          content: '登录身份已失效，请重新登录!',
          okText: '确定',
          closable: false,
          maskClosable: false,
          onOk: async () => {
            storage.clear();
            window.location.href = LoginPath;
          },
        });
      } else {
        Message?.error(message);
        // throw new Error(message);
      }
    },
  },
});

// 项目，多个不同 api 地址，可导出多个实例
// export const Alova = createAlova({
//   // baseURL: 'http://localhost:9001',
//     baseURL: apiUrl,
// //   // statesHook: VueHook,
// //   // cacheLogger: process.env.NODE_ENV === 'development',
//   requestAdapter: adapterFetch(),
// });
