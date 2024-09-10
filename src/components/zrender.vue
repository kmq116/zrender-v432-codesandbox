<template>
  <div
    style="width: 100vw; height: 100vh; border: 1px solid #000"
    class="example-container"
  ></div>
</template>

<script>
import zrender from "zrender";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    var container = document.getElementsByClassName("example-container")[0];
    var zr = zrender.init(container);

    var w = zr.getWidth();
    var h = zr.getHeight();

    // 创建更大的多边形
    var polygon = new zrender.Polygon({
      shape: {
        points: [
          [50, 50],
          [550, 50],
          [750, 300],
          [550, 550],
          [50, 550],
        ],
      },
      style: {
        fill: "rgba(220, 20, 60, 0.4)", // 半透明的红色
        stroke: "#DC143C", // 深红色边框
        lineWidth: 2,
      },
      z: -2, // 确保多边形在矩形和网格线下方
    });

    // 将多边形添加到场景
    zr.add(polygon);

    // 在多边形边上添加格子
    this.addGridsOnEdges(zr, polygon.shape.points);

    // 添加可拖动的点
    this.addDraggablePoint(zr);
  },
  methods: {
    addGridsOnEdges(zr, points) {
      const gridSize = 20; // 格子大小
      const gridColor = "rgba(0, 0, 255, 0.5)"; // 格子颜色

      for (let i = 0; i < points.length; i++) {
        const start = points[i];
        const end = points[(i + 1) % points.length];

        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const numGrids = Math.floor(distance / gridSize);

        for (let j = 0; j < numGrids; j++) {
          const t = j / numGrids;
          const x = start[0] + dx * t;
          const y = start[1] + dy * t;

          const grid = new zrender.Rect({
            shape: {
              x: x - gridSize / 2,
              y: y - gridSize / 2,
              width: gridSize,
              height: gridSize,
            },
            style: {
              fill: gridColor,
              stroke: "blue",
            },
            z: -1, // 确保格子在多边形上方
          });

          zr.add(grid);
        }
      }
    },
    addDraggablePoint(zr) {
      const point = new zrender.Circle({
        shape: {
          cx: 300,
          cy: 300,
          r: 10,
        },
        style: {
          fill: "red",
          cursor: "move",
        },
        draggable: true,
        z: 2, // 确保点在其他元素上方
      });

      point.on("mouseover", function () {
        this.attr({
          style: {
            fill: "blue",
          },
        });
      });

      point.on("mouseout", function () {
        this.attr({
          style: {
            fill: "red",
          },
        });
      });

      point.on("drag", function () {
        // 可以在这里添加拖动时的逻辑
        console.log("正在拖动点", this.shape.cx, this.shape.cy);
      });

      zr.add(point);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
