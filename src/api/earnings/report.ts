import { Alova } from '@/utils/http/alova';

export const getDayReportFilePathService = (params: any): Promise<{ report_file: string }> => {
  return Alova.Get('/day_report/report_file', {
    params,
  });
};
