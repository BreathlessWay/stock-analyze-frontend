<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <!--        <div class="view-account-top-logo">-->
        <!--          <img :src="websiteConfig.loginImage" alt="" />-->
        <!--        </div>-->
        <div class="view-account-top-desc">注册用户</div>
      </div>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          label-width="100"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item path="username" label="用户名">
            <n-input
              v-model:value="formInline.username"
              minlength="5"
              maxlength="10"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password1" label="密码">
            <n-input
              v-model:value="formInline.password1"
              minlength="5"
              maxlength="10"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password2" label="确认密码">
            <n-input
              v-model:value="formInline.password2"
              minlength="5"
              maxlength="10"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading">
              注册
            </n-button>
            <n-button @click="handleLogin" size="large">登陆</n-button>
          </n-space>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { type FormItemRule, useMessage } from 'naive-ui';
  import { ResultEnum } from '@/enums/httpEnum';
  import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';
  interface FormState {
    username: string;
    password: string;
  }

  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);

  const formInline = reactive({
    username: '',
    password1: '',
    password2: '',
  });

  const rules = {
    username: {
      required: true,
      validator(_: FormItemRule, value: string) {
        let v = value ? value.trim() : value;
        if (!v) {
          return new Error('请输入用户名');
        }
        if (v.length < 5) {
          return new Error('用户名最少5位');
        }
        return true;
      },
      trigger: 'blur',
    },
    password1: {
      required: true,
      validator(_: FormItemRule, value: string) {
        let v = value ? value.trim() : value;
        if (!v) {
          return new Error('请输入密码');
        }
        if (v.length < 5) {
          return new Error('密码最少5位');
        }
        return true;
      },
      trigger: 'blur',
    },
    password2: {
      required: true,
      validator(_: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入确认密码');
        }
        if (value !== formInline.password1) {
          return new Error('两次输入密码不一致');
        }
        return true;
      },
      trigger: 'blur',
    },
  };

  const userStore = useUserStore();

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { username, password1 } = formInline;
        message.loading('登录中...');
        loading.value = true;

        const params: FormState = {
          username,
          password: password1,
        };

        try {
          const { code, message: msg } = await userStore.login(params);
          message.destroyAll();
          if (code == ResultEnum.SUCCESS) {
            message.success('注册成功');
            await router.replace('/login');
          } else {
            message.info(msg || '注册失败');
          }
        } finally {
          loading.value = false;
        }
      } else {
        message.error('请填写完整信息，并且进行验证码校验');
      }
    });
  };

  const handleLogin = () => {
    router.push({
      name: 'Login',
    });
  };
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      flex: 1;
      padding: 32px 12px;
      width: 500px;
      margin: 100px auto;
    }

    &-top {
      padding: 32px 0;
      text-align: center;

      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>
