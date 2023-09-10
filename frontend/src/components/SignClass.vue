<script>
const URL = "https://teachablemachine.withgoogle.com/models/2aXYqwnRr/";

import * as tmImage from '@teachablemachine/image';
import '@tensorflow/tfjs';

export default {
  name: "SignClass",
  data() {
    return {
      model: null,
      webcam: null, 
      labelContainer: null, 
      maxPredictions: null,
    };
  },
  emits: ["letterDetected"],
  // this.$emit("letterDetected", letter) -> Run this code to emit the letterDetected event
  methods : {
    async init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        this.model = await Object.freeze(await tmImage.load(modelURL, metadataURL));
        this.maxPredictions = this.model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        this.webcam = new tmImage.Webcam(360, 360, flip); // width, height, flip
        await this.webcam.setup(); // request access to the webcam
        await this.webcam.play();
        window.requestAnimationFrame(this.loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(this.webcam.canvas);
        this.labelContainer = document.getElementById("label-container");
        for (let i = 0; i < this.maxPredictions; i++) { // and class labels
            this.labelContainer.appendChild(document.createElement("div"));
        }
    },
    async loop() {
        this.webcam.update(); // update the webcam frame
        await this.predict();
        window.requestAnimationFrame(this.loop);
    },
    indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
  },
  async sleep(time){
    return new Promise(res => setTimeout(res, time, "done"));
},
    // run the webcam image through the image model
    async predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await this.model.predict(this.webcam.canvas);
        let probs = []
        let classnames = []
        for (let i = 0; i < this.maxPredictions; i++) {
            probs.push(prediction[i].probability.toFixed(2));
            classnames.push(prediction[i].className);
        }
        const classPrediction = classnames[this.indexOfMax(probs)] + ": " + (Math.max.apply(Math, probs)*100).toFixed(1) + "%";
        this.labelContainer.innerHTML = classPrediction;
        if (Math.max.apply(Math, probs) > 0.9){
          this.$emit("letterDetected", classnames[this.indexOfMax(probs)]);
          // await this.sleep(500);
           //called whenever you decide on a letter
        }
    },
  },
  mounted(){
    this.init();
  }
};
</script>

<template>
    <div id="webcam-container"></div>
    <div id="label-container"></div>
</template>