<template>
  <n-space align="center">
    <n-button text tag="a" href="https://anyway.fm/news.php" target="_blank" download="模板">
      下载模板
    </n-button>
    <n-upload
      class="earnings-analyze_upload"
      v-model:file-list="uploadFile"
      action="https://naive-upload.free.beeceptor.com/"
      accept=".xls,.xlsx"
      show-download-button
      @before-upload="beforeUpload"
      @remove="handleRemove"
      @download="handleDownload"
      :custom-request="customRequest"
    >
      <n-button v-show="!uploadFile.length" quaternary type="primary">上传文件</n-button>
    </n-upload>
  </n-space>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  import { useMessage } from 'naive-ui';

  import { Alova } from '@/utils/http/alova';

  import type { UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui';

  const allowedExtensions = ['xls', 'xlsx'];
  const allowedSize = 1024 * 1024 * 5;
  const message = useMessage();

  type UploadFileType =
    | {
        id: string;
        name: string;
        url: string;
        status: string;
      }[];

  const modalValue = defineModel<string[]>('stocks', {
    required: true,
  });

  const loading = ref(false);
  const uploadFile = ref<UploadFileType>([]);

  const handleRemove = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    console.log(data, uploadFile.value);
    uploadFile.value = [];
  };

  const handleDownload = (file: UploadFileInfo) => {
    message.success(`下载成功：${file.name}`);
  };

  const beforeUpload = (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    const fileExtension = data.file.file?.name.split('.').pop()?.toLowerCase() ?? '';
    if (!allowedExtensions.includes(fileExtension)) {
      message.error('只能上传 excel 文件，请重新上传');
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
    headers,
    withCredentials,
    action,
    onFinish,
    onError,
    onProgress,
  }: UploadCustomRequestOptions) => {
    console.log(file);
    try {
      loading.value = true;
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key as keyof UploadCustomRequestOptions['data']]);
        });
      }
      formData.append(file.name, file.file as File);
      const res = await Alova.Post(action as string, {
        withCredentials,
        headers: headers as Record<string, string>,
        body: formData,
        onUploadProgress: ({ percent }) => {
          onProgress({ percent: Math.ceil(percent) });
        },
      });
      console.log(res);
      modalValue.value = ['1111111'];
      message.success('解析成功');
      onFinish();
    } catch (e: any) {
      message.error(e.message || '文件上传解析失败');
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
