export const useDownload = (fileUrl: string, fileName = '') => {
  fileUrl = `${import.meta.env.VITE_GLOB_API_URL}/${fileUrl}`;
  // 创建一个临时的 a 标签用于下载
  const link = document.createElement('a');
  link.target = '_blank';
  link.href = fileUrl;
  link.download = fileName; // 设置下载文件名
  document.body.appendChild(link); // 将 a 标签添加到文档中
  link.click(); // 触发下载

  // 清理
  document.body.removeChild(link);
};
