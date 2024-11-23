<template>
  <div id="app">
    <!-- <ZrenderComponent /> -->
    <Example />
  </div>
</template>

<script>
import ZrenderComponent from "./components/zrender";
import Example from "./components/Example";
export default {
  name: "App",
  components: {
    ZrenderComponent,
    Example,
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
