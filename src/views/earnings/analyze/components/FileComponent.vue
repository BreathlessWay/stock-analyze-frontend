<template>
  <n-space align="center">
    <n-button text @click="handleDownloadTemplate">下载模板</n-button>
    <n-upload
      class="earnings-analyze_upload"
      v-model:file-list="uploadFile"
      action="/earnings/analyze_file"
      accept=".xls,.xlsx,.csv"
      show-download-button
      @before-upload="beforeUpload"
      @remove="handleRemove"
      @download="handleDownload"
      :custom-request="customRequest"
    >
      <n-button v-show="!uploadFile.length" quaternary type="primary">上传文件</n-button>
    </n-upload>
    <n-button v-show="showResultBtn" text @click="handleDownloadResult" type="info">
      下载分析结果
    </n-button>
  </n-space>
</template>
<script setup lang="ts">
  import { ref, watch, computed } from 'vue';

  import { useMessage } from 'naive-ui';

  import { useDownload } from '@/hooks/useDownload';

  import { useUserStore } from '@/store/modules/user';

  import { Alova } from '@/utils/http/alova';

  import {
    deleteFileService,
    getAnalyzeResultFilePathService,
    getTemplateFilePathService,
  } from '@/api/earnings/analyze';

  import type { UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui';
  import type { AnalyzeStockServiceResultType } from '@/api/earnings/analyze';

  const allowedExtensions = ['xls', 'xlsx', 'csv'];
  const allowedSize = 1024 * 1024 * 5;
  const message = useMessage();

  type UploadFileType =
    | {
        id: string;
        name: string;
        url: string;
        status: string;
      }[];

  const props = defineProps<{
    analyzeResult: AnalyzeStockServiceResultType | null;
  }>();

  const userStore = useUserStore();

  const loading = ref(false);
  const uploadFile = ref<UploadFileType>([]);

  const showResultBtn = computed(() => {
    return props.analyzeResult && props.analyzeResult.tradeDateList.length;
  });

  watch(
    () => userStore.info,
    () => {
      if (userStore.token && userStore.info.uploadFilePath) {
        const [, , name] = userStore.info.uploadFilePath.split('/');
        uploadFile.value = [
          {
            id: Date.now().toString(),
            name,
            url: `${import.meta.env.VITE_GLOB_API_URL}/${userStore.info.uploadFilePath}`,
            status: 'finished',
          },
        ];
      }
    },
    {
      immediate: true,
    }
  );

  const handleDownloadTemplate = async () => {
    try {
      const res = await getTemplateFilePathService();
      if (res) {
        useDownload(res.template_file);
        return;
      }
      throw '';
    } catch (e) {
      message.error('获取模板文件失败');
    }
  };

  const handleDownloadResult = async () => {
    try {
      const res = await getAnalyzeResultFilePathService();
      if (res) {
        useDownload(res.analyze_file);
        return;
      }
      throw '';
    } catch (e) {
      message.error('获取分析结果文件失败');
    }
  };

  const handleRemove = async () => {
    try {
      const res = await deleteFileService();
      if (res) {
        uploadFile.value = [];
        const { uploadFilePath, ...rest } = userStore.info;
        userStore.setUserInfo({
          ...rest,
          uploadFilePath: '',
        });
        return '';
      }
      throw '';
    } catch (e) {
      message.error('删除文件失败');
    }
  };

  const handleDownload = (file: UploadFileInfo) => {
    message.success(`下载成功：${file.name}`);
  };

  const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    const fileExtension = data.file.file?.name.split('.').pop()?.toLowerCase() ?? '';
    if (!allowedExtensions.includes(fileExtension)) {
      message.error('只能上传 excel 或 csv 文件，请重新上传');
      return false;
    }
    if ((data.file.file?.size ?? 0) / allowedSize > 1) {
      message.error('上传文件大小不能超过 5M !');
      return false;
    }

    return true;
  };

  const customRequest = async ({
    file,
    data,
    action,
    onFinish,
    onError,
  }: UploadCustomRequestOptions) => {
    try {
      loading.value = true;
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
        });
      }
      formData.append('file', file.file as File);
      const res = (await Alova.Post(action as string, formData)) as { uploadFilePath: string };
      if (res) {
        const { uploadFilePath, ...rest } = userStore.info;
        userStore.setUserInfo({
          ...rest,
          uploadFilePath: res.uploadFilePath,
        });
        message.success('文件上传成功');
      }
      onFinish();
    } catch (e: any) {
      message.error(e.message || '文件上传失败');
      onError();
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped lang="less">
  .earnings-analyze_upload {
    width: 220px;
    display: flex;
    align-items: center;
    :deep(.n-upload-file-list) {
      margin-top: 0;
      flex: 1;
    }
    :deep(.n-upload-file-info) {
      padding: 0 !important;
      align-items: center;
    }
    :deep(.n-upload-file-list .n-upload-file .n-upload-file-info .n-upload-file-info__name) {
      max-width: 120px;
      width: 0;
      white-space: nowrap;
      display: inline-block;
    }
  }
</style>
