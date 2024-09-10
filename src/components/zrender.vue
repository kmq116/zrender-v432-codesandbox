<template>
  <div
    style="width: 100vw; height: 100vh; border: 1px solid #000"
    class="example-container"
  ></div>
</template>

<script>
import zrender from "zrender";

function calculateAngleBetweenLines(x1, y1, x2, y2, x3, y3, x4, y4) {
  // 计算第一条线的方向向量
  const vector1 = {
    x: x2 - x1,
    y: y2 - y1,
  };

  // 计算第二条线的方向向量
  const vector2 = {
    x: x4 - x3,
    y: y4 - y3,
  };

  // 计算两个向量的点积
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

  // 计算两个向量的模
  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

  // 计算夹角的余弦值
  const cosTheta = dotProduct / (magnitude1 * magnitude2);

  // 使用反余弦函数计算夹角（弧度）
  let angle = Math.acos(cosTheta);

  // 计算叉积来确定旋转方向
  const crossProduct = vector1.y * vector2.x - vector1.x * vector2.y;

  // 如果叉积为负，说明是顺时针旋转，角度应该大于 π
  if (crossProduct < 0) {
    angle = 2 * Math.PI - angle;
  }

  return angle; // 直接返回 0-2π 之间的弧度
}
let sector1 = null;

let initialAngle = 0;
let dynamicAngle = 0;
export default {
  name: "HelloWorld",
  data() {
    return {
      grids: [], // 用于存储所有格子的数组
      isDragging: false,
      shape: null,
      line1: null,
      line2: null,
    };
  },
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
      draggable: true,
      z: -2, // 确保多边形在矩形和网格线下方
    });
    // 添加拖动事件监听器
    polygon.on("drag", (e) => {
      const x = Math.round(e.offsetX);
      const y = Math.round(e.offsetY);
      console.log(`多边形当前位置: (${x}, ${y})`);
      console.log(e);
    });
    // 将多边形添加到场景
    zr.add(polygon);

    // 在多边形边上添加格子
    this.addGridsOnEdges(zr, polygon.shape.points);

    // 添加可拖动的点
    this.addDraggablePoint(zr);

    // 添加扇形
    this.addSector(zr);

    // 创建两条线段
    this.line1 = new zrender.Line({
      shape: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      },
      style: {
        stroke: "blue",
        lineWidth: 2,
        opacity: 0,
      },
      z: 3,
    });

    this.line2 = new zrender.Line({
      shape: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      },
      style: {
        stroke: "green",
        lineWidth: 2,
        opacity: 0,
      },
      z: 3,
    });

    zr.add(this.line1);
    zr.add(this.line2);

    zr.on("mousemove", (e) => {
      if (this.isDragging) {
        const cx = sector1.shape.cx;
        const cy = sector1.shape.cy;

        // 更新第一条线（从扇形中心到鼠标当前位置）
        this.line1.attr({
          shape: {
            x1: cx,
            y1: cy,
            x2: e.offsetX,
            y2: e.offsetY,
          },
          style: { opacity: 1 },
        });

        // 更新第二条线（从扇形中心到鼠标按下时的位置）
        this.line2.attr({
          shape: {
            x1: cx,
            y1: cy,
            x2: this.mousedownX,
            y2: this.mousedownY,
          },
          style: { opacity: 1 },
        });

        const angle = calculateAngleBetweenLines(
          cx,
          cy,
          e.offsetX,
          e.offsetY,
          cx,
          cy,
          this.mousedownX,
          this.mousedownY
        );

        console.log(`两条线之间的夹角（弧度）：${angle}`);
        console.log(`两条线之间的夹角（度数）：${angle * (180 / Math.PI)}`);

        sector1.attr({
          shape: {
            startAngle: initialAngle + angle,
            endAngle: initialAngle + angle + Math.PI / 6,
          },
        });
        dynamicAngle = angle;
        // 强制重新渲染
        // zr.refresh();
      }
    });

    zr.on("mouseup", (e) => {
      console.log("mouseup");
      console.log(this.isDragging);

      // 隐藏线段
      this.line1.attr({ style: { opacity: 0 } });
      this.line2.attr({ style: { opacity: 0 } });
      if (this.isDragging) {
        initialAngle = initialAngle + dynamicAngle;
        this.isDragging = false;
      }
      // zr.refresh();
    });
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

          this.grids.push({ x: x, y: y }); // 将格子的中心点坐标存储到数组中
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

      point.on("drag", (e) => {
        console.log(e);
        const x = e.offsetX;
        const y = e.offsetY;
        console.log(x, y);
        const nearestGrid = this.findNearestGrid(x, y);
        console.log({ nearestGrid });
        if (nearestGrid) {
          const distance = Math.sqrt(
            Math.pow(x - nearestGrid.x, 2) + Math.pow(y - nearestGrid.y, 2)
          );
          console.log(distance);
        }
      });

      zr.add(point);
    },
    findNearestGrid(x, y) {
      let nearestGrid = null;
      let minDistance = Infinity;

      for (const grid of this.grids) {
        const distance = Math.sqrt(
          Math.pow(x - grid.x, 2) + Math.pow(y - grid.y, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestGrid = grid;
        }
      }

      return nearestGrid;
    },
    addSector(zr) {
      const initialAngle = Math.PI / 6;
      sector1 = new zrender.Sector({
        shape: {
          cx: 100, // 圆心x坐标
          cy: 100, // 圆心y坐标
          r: 100, // 半径
          r0: 0, // 内半径，0表示实心扇形
          startAngle: 0, // 开始角度，单位是弧度
          // endAngle: Math.PI / 2, // 结束角度，这里设置为90度（π/2弧度）
          endAngle: initialAngle, // 结束角度，这里设置为90度（π/2弧度）
        },
        style: {
          fill: "rgba(255, 0, 0, 0.6)", // 半透明橙色
          stroke: "#FF8C00", // 深橙色边框
          lineWidth: 2,
        },
        z: 1, // 确保扇形在多边形上方
      });

      sector1.on("mousedown", (e) => {
        console.log(e);
        console.log("mousedown sector1");
        // 记录鼠标按下的位置
        this.mousedownX = e.offsetX;
        this.mousedownY = e.offsetY;
        console.log(this.mousedownX, this.mousedownY);
        this.isDragging = true;
        console.log(this.isDragging);
        console.log("mousedown");
        // this.attr({
        //   style: {
        //     fill: "blue",
        //   },
        // });
      });
      // 记录完坐标后，鼠标移动时，计算新的位置,跟初始坐标去对比相对起始点的角度

      // sector1.on("mouseup", (e) => {
      //   this.isDragging = false;
      //   console.log("mouseup");
      //   console.log(this.isDragging);
      // });

      const sector2 = new zrender.Sector({
        shape: {
          cx: 100, // 圆心x坐标
          cy: 100, // 圆心y坐标
          r: 100, // 半径
          r0: 0, // 内半径，0表示实心扇形
          startAngle: 0, // 开始角度，单位是弧度
          // endAngle: Math.PI / 2, // 结束角度，这里设置为90度（π/2弧度）
          endAngle: Math.PI / 6, // 结束角度，这里设置为90度（π/2弧度）
        },
        style: {
          fill: "rgba(255, 165, 0, 0.6)", // 半透明橙色
          stroke: "#FF8C00", // 深橙色边框
          lineWidth: 2,
        },
        draggable: true, // 使扇形可拖动
        z: 1, // 确保扇形在多边形上方
      });

      // 添加拖动事件监听器
      sector2.on("drag", (e) => {
        const x = Math.round(e.offsetX);
        const y = Math.round(e.offsetY);
        console.log(`扇形当前位置: (${x}, ${y})`);
      });

      zr.add(sector1);
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
