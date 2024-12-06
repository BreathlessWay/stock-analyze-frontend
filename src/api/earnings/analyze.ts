import { Alova } from '@/utils/http/alova';

export const getTemplateFilePathService = (): Promise<{ template_file: string }> => {
  return Alova.Get('/earnings/template_file');
};

export const deleteFileService = (): Promise<{ template_file: string }> => {
  return Alova.Delete('/earnings/analyze_file');
};

export const analyzeStockService = (
  params: any
): Promise<{ msg: string; x: string[]; y: number[] }> => {
  return Alova.Get('/earnings/analyze_stock', {
    params,
  });
};
