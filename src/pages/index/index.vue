<template>
  <div>
    <n-space class="w-full px-6 h-64px border-b" justify="space-between">
      <n-space justify="space-between" class="h-full px-2 space-x-3 w-full" align="center">
        <n-el>
          <p class="font-bold text-2xl">小键盘练习</p>
        </n-el>
      </n-space>
      <n-space class="w-full h-full px-2 space-x-3" align="center">
        <div>
          <n-icon size="32" @click="goDemo" class="hover:cursor-pointer">
            <i-logos-github-icon />
          </n-icon>
        </div>
        <div class="h-full py-3 border-l text-gray-400"></div>
        <n-el class="w-10">
          <div>
            <n-avatar class="p-5" round>{{ userStore.userInfo.nickname }}</n-avatar>
          </div>
        </n-el>
      </n-space>
    </n-space>
    <div class="flex flex-col justify-center items-center gap-5 mt-5">
      <div>
        <n-icon size="88">
          <i-teenyicons-mood-smile-solid class="text-yellow-200" />
        </n-icon>
      </div>

      <n-space>
        <n-button autofocus @click="startDemo" type="primary">开始练习</n-button>

        <n-button autofocus @click="removeDemo" type="primary">清除信息</n-button>

        <!-- <n-button autofocus @click="removeDemo" type="primary">清除信息</n-button> -->
      </n-space>

      <div>
        <n-table
          :bordered="false"
          :single-line="false"
          v-if="userStore.isLogin && userStore.examScoresInfo.length != 0"
        >
          <thead>
            <tr>
              <th>序号</th>
              <th>正确数量</th>
              <th>错误数量</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in getHistData" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.correctCount }}</td>
              <td>{{ item.errorCount }}</td>
              <td>
                <n-time
                  :time="new Date(item.startTime)"
                  class="align-middle"
                  format="yyyy年MM月dd日 HH时mm分"
              /></td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>

    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="提示"
        :bordered="false"
        :mask-closable="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-space vertical>
          <div class="flex flex-col gap-2">
            <div class="flex justify-center items-center">
              <div class="w-15">昵称:</div>
              <n-input
                v-model:value="nickName"
                placeholder="你的昵称"
                @keyup.enter="submitName"
              ></n-input>
            </div>
            <p class="mt-2 text-xs text-gray-500"
              >你的信息只保存在本地，清楚浏览器缓存历史数据将会消失</p
            >
            <p class="mt-2 text-xs text-gray-500">站内测试成绩仅供参考，实际成绩以考试为准</p>
          </div>
        </n-space>
        <template #footer>
          <n-space justify="end">
            <n-button type="primary" @click="submitName">确定</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

    <div>
      <p> </p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useRouterPush } from '@/router/router';
  import { useUserStore } from '@/store';
  import { NInput } from 'naive-ui';
  import { computed, ref } from 'vue';

  const router = useRouterPush();
  const showModal = ref(false);
  const nickName = ref('');
  const userStore = useUserStore();

  const startDemo = () => {
    console.log(userStore.isLogin);
    if (!userStore.isLogin) {
      showModal.value = true;
      return;
    }
    router.routerPush({ name: 'exam' });
  };
  const submitName = () => {
    if (nickName.value.length == 0 || nickName.value.trim().length == 0) {
      window.$message.warning('名称不符合规范!');
    }
    userStore.loginLocal(nickName.value);
    showModal.value = false;
  };

  const removeDemo = () => {
    userStore.logout();
    window.$message.success('清除成功！');
  };

  const getHistData = computed(() => {
    return userStore.examScoresInfo.reverse();
  });

  const goDemo = () => {
    window.open('http://www.baidu.com', '_blank');
  };
</script>
<style scoped></style>
