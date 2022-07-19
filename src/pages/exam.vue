<template>
  <div>
    <n-space class="w-full px-6 min-h-min-64px border-b" justify="space-between">
      <n-space justify="space-between" class="h-full px-2 space-x-3 w-full" align="center">
        <n-el>
          <p class="font-bold text-2xl hover:cursor-pointer">小键盘练习</p>
        </n-el>
      </n-space>
      <n-space class="w-full h-full px-2 space-x-3" align="center">
        <n-space>
          <div v-if="isRunning" class="w-20">
            <n-button text type="primary" @click="overExamFn">交卷</n-button>
          </div>
          <div v-if="isRunning">
            {{ `正确组数:${examDataRef.correctCount}` }}
          </div>
          <div v-if="isRunning">
            {{ `错误组数:${examDataRef.errorCount}` }}
          </div>
        </n-space>
        <n-el>
          <p class="font-bold"> {{ count }}</p>
        </n-el>
        <div class="h-full py-3 border-l text-gray-400"></div>
        <n-el class="w-10">
          <div>
            <n-avatar class="p-5" round>{{ nickName }}</n-avatar>
          </div>
        </n-el>
      </n-space>
    </n-space>

    <div class="px-5 mt-8">
      <n-space vertical v-if="currentCount != strArrLength - 1 && isRunning">
        <div class="flex flex-col">
          <div class="flex text-2xl px-3">
            <span
              v-for="(item, index) in getCurrentData"
              :key="index"
              class="index-block"
              :class="{
                rightInput: currentInputRef.at(index) == item,
                errorInput: currentInputRef.at(index) != item && index < currentInputRef.length,
              }"
            >
              {{ item }}
            </span>
          </div>

          <div class="w-50">
            <n-input
              ref="inputVal"
              @keyup.enter="nextCount"
              :maxlength="getCurrentData?.length"
              autofocus
              v-model:value="currentInputRef"
              placeholder=""
              class="text-2xl"
            ></n-input>
          </div>
        </div>

        <div class="flex flex-col">
          <div class="flex text-2xl px-3">
            <span v-for="(item, index) in getNextData" :key="index" class="index-block">
              {{ item }}
            </span>
          </div>
          <div class="w-50">
            <n-input
              :disabled="Boolean(1)"
              :maxlength="getNextData?.length"
              autofocus
              placeholder=""
              class="text-2xl"
            ></n-input>
          </div>
        </div>
      </n-space>
      <n-space v-else class="w-full" vertical align="center" justify="center">
        <div v-if="examDataRef.correctCount < 80">
          <n-icon size="64">
            <i-ic-baseline-mood class="text-red" />
          </n-icon>
          <p>加油加油！ </p>
        </div>
        <div v-else>
          <n-icon size="64">
            <i-teenyicons-mood-laugh-outline class="text-red" />
          </n-icon>
          <p> 很棒很棒！ </p>
        </div>

        <div>
          <p class="text-2xl">
            {{ `测试完成!正确组数${examDataRef.correctCount},错误组数${examDataRef.errorCount}。` }}
          </p>
        </div>
        <n-space>
          <n-button @click="reload">再来一把</n-button>
          <n-button @click="router.toHome()">返回主页</n-button>
        </n-space>
      </n-space>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { Dto } from '@/model';
  import { useRouterPush } from '@/router/router';
  import { useUserStore } from '@/store';
  import { toInteger } from 'lodash';
  import { InputInst } from 'naive-ui/lib/input/src/interface';
  import { computed, onMounted, reactive, ref, watch } from 'vue';

  const strArrLength = 300;

  const inputVal = ref<InputInst | null>(null);
  const isRunning = ref(true);
  const userStore = useUserStore();

  const router = useRouterPush();
  if (!userStore.isLogin) {
    router.toHome();
  }
  const nickName = computed(() => {
    return userStore.userInfo.nickname;
  });
  const currentCount = ref(0);
  const currentInputRef = ref('');

  const getCurrentData = computed(() => {
    return dataRef != undefined
      ? (dataRef.value?.at(currentCount.value) as String)
      : ('' as String);
  });

  const getNextData = computed(() => {
    return dataRef != undefined
      ? (dataRef.value?.at(currentCount.value + 1) as String)
      : ('' as String);
  });
  const dataRef = ref<Array<String>>();
  const examDataRef = reactive<Dto.ExamData>({
    startTime: new Date(),
    correctCount: 0,
    errorCount: 0,
  });

  const nextCount = () => {
    if (currentInputRef.value.length != 0) {
      if (currentInputRef.value != getCurrentData.value) {
        examDataRef.errorCount += 1;
      } else {
        examDataRef.correctCount += 1;
      }
    }
    currentCount.value += 1;
    currentInputRef.value = '';
    if (currentCount.value == strArrLength) {
      overExamFn();
    }
  };
  const timer = ref<NodeJS.Timer>();

  const seconds = ref(60 * 3);
  const count = ref('');

  const countDown = () => {
    // let d = seconds.value / (24 * 60 * 60);
    // const dd = d < 10 ? '0' + d : d;
    // let h = (seconds.value / (60 * 60)) % 24;
    // const hh = h < 10 ? '0' + h : h;
    let m = toInteger(seconds.value / 60);
    const mm = m < 10 ? '0' + m : m;
    let s = seconds.value % 60;
    const ss = s < 10 ? '0' + s : s;
    // return dd + '天' + hh + '时' + mm + '分' + ss + '秒';
    count.value = mm + '分' + ss + '秒';
  };

  const overExamFn = () => {
    if (timer.value != undefined) {
      console.log('清楚时间');
      clearTimeout(timer.value);
    }

    userStore.updateExamInfo(examDataRef);
    window.$dialog.create({
      title: '提示',
      type: 'success',
      content: `考试完成成绩!正确组数${examDataRef.correctCount},错误组数${examDataRef.errorCount}。`,
      positiveText: '完成',
      maskClosable: false,
      onPositiveClick: () => {
        isRunning.value = false;
      },
    });
  };

  const reload = () => {
    window.location.reload();
  };
  onMounted(() => {
    countDown();
    dataRef.value = Array.from({ length: strArrLength }, () => {
      const le = Math.floor(Math.random() * 6 + 2);

      // 解决随机数1打头bug
      return (
        Math.floor(Math.random() * (Math.pow(10, le + 1) - Math.pow(10, le))) +
        Math.pow(10, le) +
        ''
      );
      // return Math.floor(Math.random() * (Math.pow(10, le+1)-Math.pow(10,le))) + (Math.pow(10, le) - 1);
    });

    window.$dialog.create({
      title: '提示',
      type: 'info',
      content: '刷新关闭浏览器将失去当前输入记录！',
      positiveText: '开始',
      closable: false,
      maskClosable: false,
      onPositiveClick: () => {
        examDataRef.startTime = new Date();
        timer.value = setInterval(() => {
          //需要定时执行的代码
          seconds.value = seconds.value - 1;
          countDown();
        }, 1000);
        setTimeout(() => {
          inputVal.value?.focus();
        }, 100);
      },
    });
  });
  watch(seconds, (value) => {
    if (value == 0 && timer.value != undefined) {
      overExamFn();
    }
  });

  //   clearTimeout(timer)
</script>
<style scoped>
  .rightInput {
    color: rgba(29, 78, 216, 1);
  }
  .errorInput {
    color: red;
  }
</style>
