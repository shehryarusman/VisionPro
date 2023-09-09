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

    /***
     * Video
     */
    /* eslint-disable */
     async captureFrameFromStream(stream) {
        return new Promise((resolve, reject) => {
            const videoElement = document.createElement('video');
            videoElement.autoplay = true;
            videoElement.onloadedmetadata = () => {
                videoElement.play();

                // When video plays, capture frame to canvas
                videoElement.onplay = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;

                    ctx.drawImage(videoElement, 0, 0);

                    // Convert canvas to HTMLImageElement
                    const img = new Image();
                    img.src = canvas.toDataURL('image/png');

                    // Resolve with the necessary elements
                    resolve({
                        videoElement: videoElement,
                        canvasElement: canvas,
                        imageElement: img
                    });

                    // Stop the video stream after capturing the frame
                    stream.getTracks().forEach(track => track.stop());
                };
            };

            videoElement.onerror = (err) => {
                reject(err);
            };

            videoElement.srcObject = stream;
        });
    },
    toggleCamera() {
    this.cameraActive = !this.cameraActive; // Toggle the cameraActive flag

    if (this.cameraActive) { // If camera is active
        this.intervalID = setInterval(() => { // Store interval ID to clear it later
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    return this.captureFrameFromStream(stream);
                })
                .then(({ videoElement, canvasElement, imageElement }) => {
                    // Clear previous image elements (optional)
                    const oldImages = document.querySelectorAll('.captured-image');
                    oldImages.forEach(img => img.remove());

                    // Add a class to new imageElement for easier selection later (optional)
                    imageElement.classList.add('captured-image');

                    // You have access to the video, canvas, and image elements here
                    document.body.appendChild(imageElement); // Append the captured image frame to the body
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }, 1000); // Repeat every 1 second
    } else { 
        clearInterval(this.intervalID); // If camera is deactivated, stop the interval
    }
},

    /**
     * NLP
     */
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
        <camera ref="video" v-if="cameraActive" :resolution=autoplay></camera>
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
