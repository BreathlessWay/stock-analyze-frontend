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
    DataZoomComponent,
  } from 'echarts/components';
  import { LineChart } from 'echarts/charts';
  import { UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';

  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    DataZoomComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
  ]);

  import type { EChartsType } from 'echarts/core';

  const props = defineProps<{
    x: number[];
    y: number[];
    loading: boolean;
  }>();

  let echartsInstance: EChartsType | null = null;

  let base = +new Date(1988, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let data = [[base, Math.random() * 300]];
  for (let i = 1; i < 20000; i++) {
    let now = new Date((base += oneDay));
    data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
  }
  const option = {
    grid: {
      left: 50,
      right: 0,
      bottom: 80,
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
    // xAxis: {
    //   type: 'category',
    //   data: [],
    // },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 20,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: '当日收益',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data,
      },
    ],
  };

  const setChartsOptions = () => {
    if (!echartsInstance) {
      const dom = document.getElementById('analyze-chart');
      echartsInstance = echarts.init(dom);
    }
    if (hasData.value) {
      const dom = document.getElementById('analyze-chart');
      dom!.style.opacity = '1';
      echartsInstance.setOption(option);
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
    margin-top: 10px;
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
