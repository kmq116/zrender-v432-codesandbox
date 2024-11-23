<template>
  <div
    ref="container"
    style="width: 50vw; height: 50vh; border: 1px solid #fff"
  ></div>
</template>

<script>
import { GeoZrender } from "../lib/GeoZrender";

export default {
  mounted() {
    // 初始化GeoZrender
    const geoZr = new GeoZrender(this.$refs.container, { padding: 0 });

    // 设置地理边界
    const boundaryPoints = [
      [113.62015139, 23.59085388],
      [113.6200707, 23.59064904],
      [113.62010765, 23.59063705],
      [113.62018834, 23.59084164],
      [113.62015139, 23.59085388],
    ];
    geoZr.initBounds(boundaryPoints);

    // 绘制边界多边形
    geoZr.drawPolygon(boundaryPoints);

    // 绘制点
    geoZr.drawPoint(113.62015139, 23.59085388, {
      fill: "blue",
      r: 8,
    });

    // 绘制线段
    geoZr.drawLine(
      [
        [113.62015139, 23.59085388],
        [113.6200707, 23.59064904],
      ],
      { stroke: "red", lineWidth: 3 }
    );
  },
};
</script>
