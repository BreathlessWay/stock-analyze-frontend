import { Alova } from '@/utils/http/alova';

export const getTemplateFilePathService = (): Promise<{ template_file: string }> => {
  return Alova.Get('/earnings/template_file');
};

export const getAnalyzeResultFilePathService = (): Promise<{ analyze_file: string }> => {
  return Alova.Get('/earnings/analyze_file');
};

export const deleteFileService = (): Promise<{ template_file: string }> => {
  return Alova.Delete('/earnings/analyze_file');
};

export type OriginalListItemType = {
  price: string;
  profitRatio: string;
  stockCode: string;
  stockCount: number;
  tradeDate: string;
  marketValue: string;
  baseProfitRatio: string;
  yieldRate: string;
  yieldRateProfitRatio: string;
  yieldRateBaseProfitRatio: string;
};

export type AnalyzeStockServiceResultType = {
  tradeDateList: string[];
  profitRatioSumList: number[];
  baseProfitRatioSumList: number[];
  finalProfitRatioSumList: number[];
  originalList: OriginalListItemType[];
};

export const analyzeStockService = (
  params: any
): Promise<{ msg: string } & AnalyzeStockServiceResultType> => {
  return Alova.Get('/earnings/analyze_stock', {
    params,
  });
};
