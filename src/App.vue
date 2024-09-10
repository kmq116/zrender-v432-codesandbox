<template>
  <div id="app">
    <ZrenderComponent />
  </div>
</template>

<script>
import ZrenderComponent from "./components/zrender";

export default {
  name: "App",
  components: {
    ZrenderComponent,
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
