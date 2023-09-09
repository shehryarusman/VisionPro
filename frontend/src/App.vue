<script>
export default {
  name: "App",
  data() {
    return {
      cameraActive: false,     // To toggle camera display
      recordingActive: false,  // To toggle audio recording
      recordedText: [],       // To store recorded text
      recognition: null,       // SpeechRecognition object
    };
  },
  methods: {
    toggleCamera() {
      this.cameraActive = !this.cameraActive; // Toggle the cameraActive flag
    },
    toggleRecording() {
      if (!this.recordingActive) {
        // Start audio recording
        this.initializeRecognition();
        this.startRecording();
      } else {
        // Stop audio recording
        this.stopRecording();
      }
    },
    initializeRecognition() {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Delay the initialization
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.interimResults = true;

        this.recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              this.recordedText.push(event.results[i][0].transcript);
              console.log(event.results[i][0].transcript);
            }
          }
        };

        this.recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
        };

        this.recognition.onend = () => {
          this.recordingActive = false;
        };
      } else {
        console.error('Speech recognition is not supported in this browser.');
      }
    },
    startRecording() {
      if (this.recognition) {
        this.recognition.start();
        this.recordingActive = true;
      } else {
        console.error('Speech recognition is not initialized.');
      }
    },
    stopRecording() {
      if (this.recognition) {
        this.recognition.stop();
      }
      this.recordingActive = false;
    },
  },
};

</script>

<template>
  <div>
    <h1 class="title has-text-centered mt-5">VisionPro</h1>

    <div class="is-flex is-flex-direction-column is-align-items-center">
  
      <div class="box">
        <h1 class="subtitle">Camera</h1>
        <!-- Display the camera if cameraActive is true -->
        <camera v-if="cameraActive" :resolution=autoplay></camera>
      </div>
  
  
      <!-- Display the recorded text here -->
      <ul class="is-flex is-flex-direction-column is-align-items-center box">
        <li v-for="(line, index) in recordedText" :key="index" class="subtitle">
          {{ line }}
        </li>
      </ul>

      <div class="is-flex is-flex-direction-row gap-30">
        <span class="is-flex is-flex-direction-column is-align-items-center">
          <a @click="toggleCamera" class="title m-0">
            <font-awesome-icon :icon="['fas', 'camera']" />
          </a>
          Show Camera
        </span>
        <span class="is-flex is-flex-direction-column is-align-items-center">
          <a @click="toggleRecording" :class="{ 'has-text-danger': recordingActive }" class="title p-0">
            <font-awesome-icon icon="fa-solid fa-microphone" />
          </a>
          Record
        </span>
      </div>
    </div>
  </div>
</template>
