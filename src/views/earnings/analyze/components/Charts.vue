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
    x: string[];
    y: number[];
    loading: boolean;
  }>();

  let echartsInstance: EChartsType | null = null;

  const option = {
    grid: {
      left: 50,
      right: 50,
      bottom: 30,
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
      data: [] as string[],
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
    },
    // dataZoom: [
    //   {
    //     type: 'inside',
    //     start: 0,
    //     end: 20,
    //   },
    //   {
    //     start: 0,
    //     end: 20,
    //   },
    // ],
    series: [
      {
        name: '当日收益率',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: [] as number[],
      },
    ],
  };

  const setChartsOptions = () => {
    const dom = document.getElementById('analyze-chart');

    if (!echartsInstance) {
      echartsInstance = echarts.init(dom);
    }
    if (hasData.value) {
      dom!.style.opacity = '1';
      console.log(props.x);
      option.xAxis.data = props.x;
      option.series[0].data = props.y;
      echartsInstance.setOption(option);
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
