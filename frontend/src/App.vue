<script>
export default {
  name: "App",
}
</script>
  
<template>
  <h1 class="title has-text-centered mt-5">VisionPro</h1>
  <camera :resolution="{ width: 375, height: 812 }" autoplay></camera>
</template>

