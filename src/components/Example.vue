<template>
  <div
    ref="container"
    style="width: 50vw; height: 50vh; border: 1px solid #fff"
  ></div>
</template>

<script>
import zrender from "zrender";
import { ZrenderGeoConverter } from "../utils/ZrenderGeoConverter";

export default {
  mounted() {
    const container = this.$refs.container;
    const zr = zrender.init(container);

    // 边界点坐标
    const boundaryPoints = [
      [113.62015139, 23.59085388],
      [113.6200707, 23.59064904],
      [113.62010765, 23.59063705],
      [113.62018834, 23.59084164],
      [113.62015139, 23.59085388],
    ];

    // 创建Zrender地理坐标转换器
    const converter = new ZrenderGeoConverter(container, boundaryPoints);

    // 绘制多边形
    const points = boundaryPoints.map((point) =>
      converter.toZrenderCoord(point[0], point[1])
    );
    const polygon = new zrender.Polygon({
      shape: { points },
      style: {
        fill: "rgba(220, 20, 60, 0.4)",
        stroke: "#DC143C",
        lineWidth: 2,
      },
    });
    zr.add(polygon);

    // 绘制点
    const [x, y] = converter.toZrenderCoord(113.62015139, 23.59085388);
    const point = new zrender.Circle({
      shape: {
        cx: x,
        cy: y,
        r: 5,
      },
      style: {
        fill: "blue",
      },
    });
    zr.add(point);
  },
};
</script>
