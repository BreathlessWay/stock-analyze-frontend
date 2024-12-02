<template>
  <article class="analyze">
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-align="right"
      inline
      require-mark-placement="right-hanging"
    >
      <n-form-item label="股票代码" path="inputValue">
        <n-input
          clearable
          maxlength="6"
          v-model:value="model.inputValue"
          placeholder="请输入股票代码"
        />
      </n-form-item>
      <n-form-item label="日期" path="datetimeValue">
        <n-date-picker v-model:value="model.datetimeValue" type="daterange" />
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="handleValidateButtonClick">查询</n-button>
        <n-button @click="reset">重置</n-button>
      </n-space>
    </n-form>
    <FileComponent v-model:stocks="stocks" />
  </article>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import FileComponent from './components/FileComponent.vue';

  import type { FormInst, FormItemRule } from 'naive-ui';

  const formRef = ref<FormInst | null>(null);
  const model = ref({
    inputValue: null,
    datetimeValue: null,
  });
  const stocks = ref<string[]>([]);
  const rules = {
    inputValue: {
      validator(_: FormItemRule, value: string) {
        if (!value) {
          return true;
        }
        if (!/^\d{6}$/.test(value)) {
          return new Error('需要6位数字的股票代码');
        }
        return true;
      },
    },
    datetimeValue: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择查询时间段',
    },
  };

  const reset = () => {
    model.value = {
      inputValue: null,
      datetimeValue: null,
    };
    formRef.value?.restoreValidation();
  };

  const handleValidateButtonClick = (e: MouseEvent) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
      if (!errors) {
        console.log(model.value, stocks.value);
      } else {
        console.log(errors);
      }
    });
  };
</script>
<style lang="less" scoped>
  .analyze {
    background: #fff;
    padding: 20px;
    border-radius: 2px;
    width: 100%;
    height: calc(100vh - 64px - 12px - 10px);
  }

  .analyze :deep(.n-form-item-label__asterisk-placeholder) {
    display: none;
  }
</style>
