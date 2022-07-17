import { Dto } from '@/model';
import { useRouterPush } from '@/router/router';
import { fetchLogin, fetchUserInfo } from '@/service';
import {
  clearAuthStorage,
  getScoreInfo,
  getToken,
  getUserInfo,
  setScoreInfo,
  setToken,
  setUserInfo,
} from '@/utils';
import { defineStore } from 'pinia';

export interface IUserState {
  token: string;
  userInfo: Dto.User;
  examScoresInfo: Array<Dto.ExamData>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: getToken(),
    userInfo: getUserInfo(),
    examScoresInfo: getScoreInfo(),
  }),
  getters: {
    isLogin(state) {
      return Boolean(state.userInfo.nickname);
    },
  },
  actions: {
    updateUserInfo(info: Dto.User) {
      setUserInfo(info);
      this.$state.userInfo = info;
    },
    updateExamInfo(info: Dto.ExamData) {
      const infoLocal = getScoreInfo();
      infoLocal.push(info);
      setScoreInfo(infoLocal);
      this.$state.examScoresInfo = infoLocal;
    },
    async loginByToken(backendToken: Dto.Token, isAdmin?: boolean) {
      const { toLoginRedirect, routerPush } = useRouterPush(false);

      // 先把token存储到缓存中
      const { prefix, token } = backendToken;
      setToken(prefix + token);

      // 获取用户信息
      const { data } = await fetchUserInfo();

      // if (isAdmin && data?.role != 'ADMIN') {
      //   window.$message.warning('请使用管理员账号登录！');
      //   clearAuthStorage();
      //   return;
      // }

      if (data) {
        // 成功后把用户信息存储到缓存中
        setUserInfo(data);
        // 更新状态
        Object.assign(this, { userInfo: data, token: prefix + token });
        // 跳转登录后的地址
        if (isAdmin) {
          routerPush({ name: 'admin' });
        }
        toLoginRedirect();

        // 登录成功弹出欢迎提示
        window.$notification?.success({
          title: '登录成功!',
          content: `欢迎回来，${data.nickname}!`,
          duration: 3000,
        });
      } else {
        // 不成功则重置状态
        this.resetAuthStore();
      }
    },
    /**
     * 登录
     * @param phone - 手机号
     * @param pwdOrCode - 密码或验证码
     * @param type - 登录方式: pwd - 密码登录; sms - 验证码登录
     */
    async login(email: string, password: string, isAdmin?: boolean) {
      // 同步等待，直接出data
      const { data } = await fetchLogin(email, password);
      if (data) {
        await this.loginByToken(data, isAdmin);
      }
    },
    async loginLocal(nickName: string) {
      // 同步等待，直接出data
      if (nickName != '') {
        const u: Partial<Dto.User> = {
          nickname: nickName,
        };
        setUserInfo(u as Dto.User);

        Object.assign(this, { userInfo: u as Dto.User, token: nickName });
        window.$notification?.success({
          title: '登录成功!',
          content: `欢迎回来，${nickName}!`,
          duration: 3000,
        });
      }
    },
    logout() {
      this.resetAuthStore();
    },
    /** 重置auth状态 */
    resetAuthStore() {
      const { toHome } = useRouterPush(false);
      clearAuthStorage();
      this.$reset();
      toHome();
    },
  },
});
