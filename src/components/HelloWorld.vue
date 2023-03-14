<template>
  <div style="width: 200px; height: 200px" class="example-container"></div>
</template>

<script>
import zrender from "zrender";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  mounted() {
    console.log(zrender);
    var container = document.getElementsByClassName("example-container")[0];
    var zr = zrender.init(container);

    var w = zr.getWidth();
    var h = zr.getHeight();

    var circle = new zrender.Circle({
      shape: {
        cx: w / 2,
        cy: h / 2,
        r: 50,
      },
      style: {
        fill: "#FF6EBE",
      },
      draggable: true,
    });

    var heart = new zrender.Heart({
      shape: {
        cx: w / 2 + 20,
        cy: h / 2 - 40,
        width: 60,
        height: 80,
      },
      draggable: true,
    });

    circle.setClipPath(heart);
    zr.add(circle);

    var borderA = new zrender.Circle({
      shape: {
        cx: w / 2,
        cy: h / 2,
        r: 50,
      },
      style: {
        fill: "transparent",
        stroke: "#5ACFFF",
      },
    });
    zr.add(borderA);

    var borderB = new zrender.Heart({
      shape: {
        cx: w / 2 + 20,
        cy: h / 2 - 40,
        width: 60,
        height: 80,
      },
      style: {
        fill: "transparent",
        stroke: "#5ACFFF",
      },
    });

    zr.add(borderB);
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
