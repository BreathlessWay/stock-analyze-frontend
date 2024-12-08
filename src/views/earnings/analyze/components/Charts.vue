<template>
  <div id="analyze-chart" class="analyze-chart"></div>
  <n-empty description="没查询到数据" v-show="!hasData" class="empty-charts" />
</template>
<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue';

  import * as echarts from 'echarts/core';
  import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
  } from 'echarts/components';
  import { LineChart } from 'echarts/charts';
  import { UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';

  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
    LegendComponent,
  ]);

  import type { EChartsType } from 'echarts/core';
  import type { AnalyzeStockServiceResultType } from '@/api/earnings/analyze';

  const props = defineProps<{
    analyzeResult: AnalyzeStockServiceResultType | null;
    loading: boolean;
  }>();

  let echartsInstance: EChartsType | null = null;

  const option = computed(() => {
    return {
      legend: {
        data: ['累计收益率', '累计基础收益率', '累计最终收益率'],
        top: 40,
      },
      grid: {
        left: 50,
        right: 50,
        bottom: 30,
        top: 80,
      },
      tooltip: {
        trigger: 'axis',
      },
      title: {
        left: 'center',
        text: '收益分析',
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        data: props?.analyzeResult?.tradeDateList ?? [],
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value: number) {
            return value * 100 + '%';
          },
        },
      },
      series: [
        {
          name: '累计收益率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: props?.analyzeResult?.profitRatioSumList ?? [],
        },
        {
          name: '累计基础收益率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: props?.analyzeResult?.baseProfitRatioSumList ?? [],
        },
        {
          name: '累计最终收益率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: props?.analyzeResult?.finalProfitRatioSumList ?? [],
        },
      ],
    };
  });

  const setChartsOptions = () => {
    const dom = document.getElementById('analyze-chart');

    if (!echartsInstance) {
      echartsInstance = echarts.init(dom);
    }
    if (hasData.value) {
      dom!.style.opacity = '1';
      echartsInstance.setOption(option.value);
    } else {
      dom!.style.opacity = '0';
    }
  };

  onMounted(() => {
    setChartsOptions();
  });

  const hasData = computed(() => {
    return (
      props.analyzeResult &&
      props.analyzeResult.tradeDateList &&
      props.analyzeResult.tradeDateList.length > 0
    );
  });

  watch(hasData, () => {
    setChartsOptions();
  });
</script>

<style scoped lang="less">
  .analyze-chart {
    margin-top: 20px;
    width: 100%;
    height: 500px;
    opacity: 0;
  }
  .empty-charts {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 260px;
  }
</style>
