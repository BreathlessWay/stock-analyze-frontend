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
        <n-date-picker
          v-model:value="model.datetimeValue"
          type="daterange"
          :is-date-disabled="disablePreviousDate"
        />
      </n-form-item>
      <n-space>
        <n-button
          type="primary"
          @click="handleValidateButtonClick"
          :loading="loading"
          :disabled="loading"
        >
          查询
        </n-button>
        <n-button @click="reset">重置</n-button>
      </n-space>
    </n-form>
    <FileComponent :analyze-result="searchResult" />
    <Charts :loading="loading" :analyze-result="searchResult" />
  </article>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import { useMessage } from 'naive-ui';
  import FileComponent from './components/FileComponent.vue';
  import Charts from './components/Charts.vue';

  import { analyzeStockService } from '@/api/earnings/analyze';

  import type { FormInst, FormItemRule } from 'naive-ui';
  import type { AnalyzeStockServiceResultType } from '@/api/earnings/analyze';

  const message = useMessage();

  const formRef = ref<FormInst | null>(null);
  const loading = ref(false);
  const model = ref({
    inputValue: null,
    datetimeValue: null,
  });
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
      validator(_: FormItemRule, value: string) {
        if (
          Array.isArray(value) &&
          value.length === 2 &&
          typeof value[0] === 'number' &&
          typeof value[1] === 'number'
        ) {
          return true;
        }
        return new Error('请选择查询时间段');
      },
    },
  };
  const searchResult = ref<AnalyzeStockServiceResultType | null>(null);

  const disablePreviousDate = (ts: number) => {
    return ts > Date.now();
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
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        loading.value = true;
        try {
          const res = await analyzeStockService({
            stock_code: model.value.inputValue || '',
            start_date: model.value?.datetimeValue?.[0],
            end_date: model.value?.datetimeValue?.[1],
          });
          searchResult.value = res;
          if (res?.msg) {
            message.warning(res.msg);
          }
        } catch (e) {
          console.log(e);
        } finally {
          loading.value = false;
        }
      } else {
        console.log(errors);
      }
    });
  };
</script>
<style lang="less" scoped>
  .analyze {
    position: relative;
    background: #fff;
    padding: 20px;
    border-radius: 2px;
    width: 100%;
    height: calc(100vh - 64px - 12px - 10px);
    overflow: auto;
  }

  .analyze :deep(.n-form-item-label__asterisk-placeholder) {
    display: none;
  }
</style>
