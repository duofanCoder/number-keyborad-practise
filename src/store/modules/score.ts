import { Dto } from '@/model';
import { useRouterPush } from '@/router/router';
import { getUserInfo } from '@/utils';
import { defineStore } from 'pinia';

export interface IUserState {
  token: string;
  userInfo: Dto.User;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => {},
  getters: {},
  actions: {
    /** 重置auth状态 */
  },
});
