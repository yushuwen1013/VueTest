<template>
  <div style="width:100%;height: 100%;">
    <iframe :src="url" style="width:100%;height: 900px;" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "https://www.json.cn/"
    };
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
</style>