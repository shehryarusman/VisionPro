import { createApp } from "vue";
import Camera from "simple-vue-camera";
import App from "./App.vue";
// CSS
import "./assets/css/main.css";

createApp(App)
.component("camera", Camera)
.mount("#app");
