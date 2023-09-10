import { createApp } from "vue";
import Camera from "simple-vue-camera";
import App from "./App.vue";
// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMicrophone, faCamera, faHeading, faHandsAslInterpreting } from "@fortawesome/free-solid-svg-icons";
// CSS
import "./assets/css/main.css";

library.add(faMicrophone);
library.add(faCamera);
library.add(faHeading);
library.add(faHandsAslInterpreting);

createApp(App)
.component("font-awesome-icon", FontAwesomeIcon)
.component("camera", Camera)
.mount("#app");
