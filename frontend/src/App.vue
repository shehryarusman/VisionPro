<template>
  <div>
    <h1 class="title has-text-centered mt-5">VisionPro</h1>
    
    <!-- Button to start camera -->
    <button @click="startCamera">Start Camera</button>

    <!-- Camera element, displayed conditionally -->
    <camera v-if="showCamera" :resolution=autoplay></camera>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      showCamera: false, // Initially hide the camera
    };
  },
  methods: {
    startCamera() {
      this.showCamera = true; // Show the camera when the button is clicked
    },
  },
};
</script>
