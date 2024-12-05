import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/user/info', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return Alova.Post<InResult>(
    '/user/login',
    {
      ...params,
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

/**
 * @description: 用户注册
 */
export function register(params) {
  return Alova.Post<InResult>(
    '/user/register',
    {
      ...params,
    },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return Alova.Post(`/user/u${uid}/changepw`, { params });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/login/logout', {
    params,
  });
}
