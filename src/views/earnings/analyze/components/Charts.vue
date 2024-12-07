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

  import BigNumber from 'bignumber.js';

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
  import type { OriginalListItemType } from '@/api/earnings/analyze';

  const props = defineProps<{
    x: string[];
    y: number[];
    list: OriginalListItemType[];
    loading: boolean;
  }>();

  let echartsInstance: EChartsType | null = null;

  const option = computed(() => {
    const firstDayPriceMap = new Map<string, string>();
    const baseProfitStockMap = new Map<string, OriginalListItemType & { baseProfit: number }>();
    props.list.forEach((item) => {
      const { stockCode, tradeDate, price } = item;

      const key = `${tradeDate}-${stockCode}`;
      if (!firstDayPriceMap.has(stockCode)) {
        firstDayPriceMap.set(stockCode, price);
        baseProfitStockMap.set(key, {
          ...item,
          baseProfit: 0,
        });
        return;
      }
      const firstDayPrice = firstDayPriceMap.get(stockCode);
      baseProfitStockMap.set(key, {
        ...item,
        baseProfit: new BigNumber(price).div(new BigNumber(firstDayPrice!)).minus(1).toNumber(),
      });
    });

    const baseProfitSumMap = new Map<string, number>();

    baseProfitStockMap.forEach((item) => {
      const { tradeDate, baseProfit } = item;
      if (baseProfitSumMap.has(tradeDate)) {
        const latestBaseProfit = baseProfitSumMap.get(tradeDate);
        baseProfitSumMap.set(
          tradeDate,
          new BigNumber(latestBaseProfit!).plus(new BigNumber(baseProfit)).toNumber()
        );
      } else {
        baseProfitSumMap.set(tradeDate, baseProfit);
      }
    });

    return {
      legend: {
        data: ['累计收益率', '当日基础收益率'],
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
        data: props.x || [],
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
          data: props.y || [],
        },
        {
          name: '当日基础收益率',
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [...baseProfitSumMap.values()],
        },
        // {
        //   name: '累计最终收益率',
        //   type: 'line',
        //   smooth: true,
        //   symbol: 'none',
        //   data: [...baseProfitSumMap.values()],
        // },
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
    return props.x?.length && props.y?.length && !props.loading;
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
