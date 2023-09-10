<script>
import _ from "lodash";
import api from "./api";
import GestureRender from "./components/GestureRender.vue";
import SignClass from "./components/SignClass.vue";
import { useSpeechSynthesis } from '@vueuse/core'

export default {
  name: "App",
  data() {
    return {
      cameraActive: true,     // To toggle camera display
      recordingActive: false,  // To toggle audio recording
      recordedText: [],       // To store recorded text
      lettersToRender: [],
      renderedLetters: [],
      recognition: null,       // SpeechRecognition object
      responseMode: "gestures", // Either "words" or "gestures"
      gestureDelay: 500,
      gestureTimer: null,
      textToSpeak: ""
    };
  },
  components: {
    GestureRender,
    SignClass,
  },
  methods: {
    /***
     * Video
     */
    toggleCamera() {
    this.cameraActive = !this.cameraActive; // Toggle the cameraActive flag
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
              const sen = event.results[i][0].transcript;
              this.recordedText.push(sen);
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
    scrollToBottom(){
      const el = this.$refs.bottomAnchor;

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    updateGesture() {
      this.renderedLetters.push(this.lettersToRender.shift());
      this.scrollToBottom();
    },
    async appendLetter(letter){
      if(letter === "ex"){
        const speech = useSpeechSynthesis(this.textToSpeak)
        speech.speak();
        this.textToSpeak = "";
      }
      else{
        // this.textToSpeak += letter;
        await new Promise(r => setTimeout(r, 20000));
        document.getElementById('message').innerHTML = "Hello";
      }
    },
  },
  watch: {
    recordedText: {
      handler(sen){
        // Hit the API
        api.post("animation", { responseType: "json", sen })
        .then(res => {
          const { data: { words } } = res;

          console.log(words);
          console.log(_.flatten(
            _.map(
              words,
              word => word.split("")
            )
          ));
          this.lettersToRender = _.flatten(
            _.map(
              words,
              word => word.split("")
            )
          );
        });
      },
      deep: true
    },
    gestureDelay() {
      clearInterval(this.gestureTimer)
      this.gestureTimer = setInterval(() => {
        this.updateGesture();
      }, this.gestureDelay);
    }
  },
  mounted() {
    this.gestureTimer = setInterval(() => {
      this.updateGesture();
    }, this.gestureDelay);
  },
  beforeUnmount() {
    clearInterval(this.gestureTimer)
  }
};

</script>

<template>
  <div class="is-flex is-flex-direction-column is-align-items-center">
    <div class="container is-flex is-flex-direction-column is-align-items-flex">
      <div class="box is-flex is-flex-direction-column is-align-items-stretch mt-5">
        
        <div class="is-flex is-flex-direction-row is-justify-content-space-between">
          <h2 class="subtitle has-text-centered m-0">Sign Sync</h2>
          <a @click="toggleCamera" class="is-flex is-flex-direction-row is-align-items-center has-text-link m-0">
            <span class="subtitle mr-2 has-text-link">
              <font-awesome-icon :icon="['fas', 'camera']" />
            </span>
            {{ cameraActive ? "Hide" : "Show" }}
          </a>
        </div>

        <div v-if="cameraActive" class="mt-2">
          <!-- <camera autoplay></camera> -->
          <SignClass @letter-detected="appendLetter"/>
          {{ textToSpeak }}
        </div>
        <div id="message"></div>

      </div>
        <div class="is-flex is-flex-direction-row mb-5 gap-15">
          <div class="field has-addons is-align-self-flex-start m-0">
            <p class="control">
              <button
                class="button"
                :class="{ 'is-info': responseMode === 'gestures' }"
                @click="() => responseMode = 'gestures'"
              >
                <span class="icon is-small">
                  <font-awesome-icon :icon="['fas', 'hands-asl-interpreting']" />
                </span>
                <span>Gestures</span>
              </button>
            </p>
            <p class="control">
              <button
                class="button"
                :class="{ 'is-info': responseMode === 'words' }"
                @click="() => responseMode = 'words'"
              >
                <span class="icon is-small">
                  <font-awesome-icon :icon="['fas', 'heading']" />
                </span>
                <span>Words</span>
              </button>
            </p>
          </div>

          <div v-if="responseMode === 'gestures'" class="is-flex is-flex-direction-row is-align-items-center gap-10">
            <label>Delay</label>
            <input type="number" class="input" v-model="gestureDelay">
            <label>milliseconds</label>
          </div>
        </div>

        
        <div class="box" style="max-height: 200px; overflow: scroll;">
          <div
            v-if="responseMode === 'gestures'"
            class="is-flex is-flex-direction-column is-align-items-center is-justify-content-flex-end"
          >
            <gesture-render
              v-for="(pastLetter, index) in renderedLetters"
              :key="index"
              :letter="pastLetter"
            />
            <gesture-render :letter="lettersToRender[0] ? lettersToRender[0].toLowerCase() : null"/>
            <div ref="bottomAnchor"></div>
          </div>

          <ul
            v-else-if="responseMode === 'words'"
            class="is-flex is-flex-direction-column is-align-items-center is-justify-content-flex-end"
          >
            <li
              v-for="(line, index) in recordedText"
              :key="index"
              class="subtitle has-text-centered m-0"
            >
              <hr v-if="index" class="m-2">
              {{ line }}
            </li>
            <div ref="bottomAnchor"></div>
          </ul>
        </div>


      <span class="is-flex is-flex-direction-column is-align-items-center">
        <a @click="toggleRecording" :class="{ 'has-text-danger': recordingActive }" class="title p-0">
          <font-awesome-icon icon="fa-solid fa-microphone" />
        </a>
        Record
      </span>
    </div>
  </div>
</template>

<style scoped>
.container{
  width: 50vw;
}

@media only screen and (max-width: 600px) {
  .container{
    width: 80vw;
  }
}
</style>
