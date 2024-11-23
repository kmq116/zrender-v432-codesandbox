<template>
  <div>
    <div class="coordinates-display">
      <p>屏幕坐标: ({{ screenX }}, {{ screenY }})</p>
      <p>经纬度: ({{ lng.toFixed(6) }}, {{ lat.toFixed(6) }})</p>
    </div>
    <div
      ref="container"
      style="width: 50vw; height: 50vh; border: 1px solid #fff"
    ></div>
  </div>
</template>

<script>
import zrender from "zrender";
import { ZrenderGeoConverter } from "../utils/ZrenderGeoConverter";

export default {
  data() {
    return {
      screenX: 0,
      screenY: 0,
      lng: 0,
      lat: 0,
      converter: null,
    };
  },
  mounted() {
    const container = this.$refs.container;
    const zr = zrender.init(container);

    // 边界点坐标
    const boundaryPoints = [
      [113.62065802082219, 23.590863199182976],
      [113.62065802082219, 23.59081423458815],
      [113.62150056935178, 23.59081423458815],
      [113.62150056935178, 23.590863199182976],
      [113.62065802082219, 23.590863199182976],
    ];

    // 创建Zrender地理坐标转换器
    this.converter = new ZrenderGeoConverter(container, boundaryPoints);

    // 绘制多边形
    const points = boundaryPoints.map((point) =>
      this.converter.toZrenderCoord(point[0], point[1])
    );
    console.log({ points });

    const polygon = new zrender.Polygon({
      shape: { points },
      style: {
        fill: "rgba(220, 20, 60, 0.4)",
        stroke: "#DC143C",
        lineWidth: 2,
      },
    });
    zr.add(polygon);

    // 监听鼠标移动事件
    zr.on("mousemove", (e) => {
      this.screenX = Math.round(e.offsetX);
      this.screenY = Math.round(e.offsetY);
      // 使用事件对象直接转换坐标
      [this.lng, this.lat] = this.converter.eventToWgs84Coord(e);
    });

    // 监听点击事件示例
    zr.on("click", (e) => {
      const [lng, lat] = this.converter.eventToWgs84Coord(e);
      console.log("点击位置经纬度:", lng, lat);

      // 在点击位置添加一个点
      const [x, y] = this.converter.toZrenderCoord(lng, lat);
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
    });
  },
};
</script>

<style scoped>
.coordinates-display {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  z-index: 1000;
}

.coordinates-display p {
  margin: 5px 0;
}
</style>
