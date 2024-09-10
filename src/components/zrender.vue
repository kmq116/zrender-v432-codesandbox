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

    // 网格大小
    const gridSize = 50;

    // 创建可拖动的矩形
    var rect = new zrender.Rect({
      shape: {
        x: w / 2 - 25,
        y: h / 2 - 25,
        width: 50,
        height: 50,
      },
      style: {
        fill: "#FF6EBE",
      },
      draggable: true,
    });

    // 创建虚线框组
    var guideLines = new zrender.Group({
      z: -1, // 将层级设置为负数，确保在最底层
    });

    // 生成网格线
    function createGridLines() {
      for (let x = gridSize; x < w; x += gridSize) {
        guideLines.add(
          new zrender.Line({
            shape: {
              x1: x,
              y1: 0,
              x2: x,
              y2: h,
            },
            style: {
              stroke: "#5ACFFF",
              lineDash: [5, 5],
              opacity: 0.5, // 降低不透明度，使线条看起来更淡
            },
          })
        );
      }
      for (let y = gridSize; y < h; y += gridSize) {
        guideLines.add(
          new zrender.Line({
            shape: {
              x1: 0,
              y1: y,
              x2: w,
              y2: y,
            },
            style: {
              stroke: "#5ACFFF",
              lineDash: [5, 5],
              opacity: 0.5, // 降低不透明度，使线条看起来更淡
            },
          })
        );
      }
    }

    createGridLines();
    guideLines.hide();

    // 添加元素到场景
    zr.add(rect);
    zr.add(guideLines);

    // 拖动事件
    rect.on("dragstart", function () {
      guideLines.show();
      // zr.refresh(); // 刷新渲染
    });

    rect.on("drag", function () {
      var pos = rect.position;
      // var newX = Math.round(pos[0] / gridSize) * gridSize;
      // var newY = Math.round(pos[1] / gridSize) * gridSize;
      // rect.attr({
      //   position: [newX, newY],
      // });
    });

    rect.on("dragend", function () {
      guideLines.hide();
      // zr.refresh(); // 刷新渲染
    });
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
