import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login, register } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  operName: string;
  email: string;
  uploadFilePath: string;
};

export interface IUserState {
  token: string;
  operName: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    operName: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.operName;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      const ex = 7 * 24 * 60 * 60;
      this.info = info;
      storage.set(CURRENT_USER, info, ex);
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      const { data, statusCode } = response;
      if (statusCode === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, data.token, ex);
        storage.set(CURRENT_USER, data, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(data.token);
        this.setUserInfo(data);
      }
      return response;
    },

    // 注册
    async register(params: any) {
      const response = await register(params);
      console.log(response);
      const { data, statusCode } = response;
      if (statusCode === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, data.token, ex);
        storage.set(CURRENT_USER, data, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(data.token);
        this.setUserInfo(data);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      const response = await getUserInfoApi();
      if (response.statusCode !== ResultEnum.SUCCESS) {
        // @ts-ignore
        window.$message.error(response.message);
        await this.logout();
        setTimeout(() => {
          location.reload();
        }, 300);
      }
      const { data } = response;
      this.setUserInfo(data);
      return data;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ operName: '', email: '', uploadFilePath: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
