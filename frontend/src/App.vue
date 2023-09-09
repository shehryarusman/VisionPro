<!-- App.vue -->
<template>
  <div>
    <h1 class="title has-text-centered mt-5">VisionPro</h1>

    <!-- Button to show/hide the camera -->
    <button @click="toggleCamera">{{ cameraActive ? 'Hide Camera' : 'Show Camera' }}</button>

    <!-- Display the camera if cameraActive is true -->
    <camera v-if="cameraActive" :resolution=autoplay></camera>

   <!-- Button to start/stop audio recording -->
    <button @click="toggleRecording">{{ recordingActive ? 'Stop Recording' : 'Start Recording' }}</button>

    <!-- Display the recorded text here -->
    <textarea v-model="recordedText" placeholder="Recorded Text"></textarea>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      cameraActive: false,     // To toggle camera display
      recordingActive: false,  // To toggle audio recording
      recordedText: "",        // To store recorded text
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
              this.recordedText += event.results[i][0].transcript;
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
