<template>
  <article class="day-report">
    <n-space>
      <n-date-picker
        v-model:value="timestamp"
        placeholder="选择需要下载的报告日期"
        type="date"
        :status="validStatus"
      />
      <n-button type="primary" @click="handleDownload" :loading="loading" :disabled="loading">
        下载
      </n-button>
    </n-space>
  </article>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { useMessage } from 'naive-ui';

  import { useDownload } from '@/hooks/useDownload';

  import { getDayReportFilePathService } from '@/api/earnings/report';

  const message = useMessage();

  const timestamp = ref(Date.now());
  const loading = ref(false);

  const validStatus = computed(() => {
    if (timestamp.value) {
      return '';
    }
    return 'error';
  });

  const handleDownload = async () => {
    if (!timestamp.value) {
      message.error('请先选择需要下载的报告日期');
    }
    loading.value = true;
    try {
      const res = await getDayReportFilePathService({
        date: timestamp.value,
      });
      if (res) {
        useDownload(res.report_file);
        return;
      }
      throw '';
    } catch (e) {
      message.error('获取报告文件失败');
    } finally {
      loading.value = false;
    }
  };
</script>
<style lang="less" scoped>
  .day-report {
    background: #fff;
    padding: 20px;
    border-radius: 2px;
    width: 100%;
    height: calc(100vh - 64px - 12px - 10px);
    overflow: auto;
  }
</style>
