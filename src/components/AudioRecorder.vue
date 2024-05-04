
<script setup>
import { ref } from 'vue';

let currentStream = null;
const chunks = ref([]);

const startRecording = () => {
  const constraints = { audio: true };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(onSuccess)
    .catch(onError);
};

const stopRecording = () => {
  console.log("Stop recording");
  if (currentStream) {
    currentStream.getTracks().forEach((track) => {
      track.stop();
    });
    currentStream = null;
  }
};

const closeRecorderModal = () => {
  const recordButton = document.querySelector(".start-record");
  recordButton.style.background=""
  recordButton.disabled = false;
  stopRecording()
};

const onSuccess = (stream) => {
  currentStream = stream;
  const mediaRecorder = new MediaRecorder(currentStream);

  mediaRecorder.ondataavailable = function (e) {
    chunks.value.push(e.data);
  };

  const recordButton = document.querySelector(".start-record");
  const stopButton = document.querySelector(".stop");
  
  recordButton.disabled = true;
  stopButton.disabled = false;

  mediaRecorder.start();
  recordButton.style.background="yellow"
  console.log("Recorder started.");

  stopButton.onclick = function () {
    mediaRecorder.stop();
    recordButton.style.background=""
    console.log(mediaRecorder.state);
    console.log("Recorder stopped.");
    
    recordButton.disabled = false;
    stopButton.disabled = true;
  };

  mediaRecorder.onstop = function (e) {
    console.log("Last data to read (after MediaRecorder.stop() called).");

    const clipName = prompt("Enter a name for your sound clip?", "My unnamed clip");

    const clipContainer = document.createElement("article");
    const clipLabel = document.createElement("p");
    const audio = document.createElement("audio");
    const deleteButton = document.createElement("button");

    clipContainer.classList.add("clip");
    audio.setAttribute("controls", "");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    clipLabel.textContent = clipName || "My unnamed clip";

    clipContainer.appendChild(audio);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(deleteButton);

    const soundClips = document.querySelector(".sound-clips");
    soundClips.appendChild(clipContainer);

    audio.controls = true;
    const blob = new Blob(chunks.value, { type: mediaRecorder.mimeType });
    chunks.value = [];
    const audioURL = window.URL.createObjectURL(blob);
    audio.src = audioURL;

    deleteButton.onclick = function (e) {
      e.target.closest(".clip").remove();
    };

    clipLabel.onclick = function () {
      const existingName = clipLabel.textContent;
      const newClipName = prompt("Enter a new name for your sound clip?");
      if (newClipName !== null) {
        clipLabel.textContent = newClipName;
      }
    };
  };
};

const onError = (err) => {
  console.log("The following error occured: " + err);
};
</script>
<template>
  <dialog id="recorder_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <button class="start-record" @click="startRecording">START</button>
      <br>
      <button class="stop" @click="stopRecording">STOP</button>
      <section class="sound-clips">
        <form method="dialog">
          <button class="btn" @click="closeRecorderModal">Close</button>
        </form> 
      </section>
    </div>
  </dialog>
</template>
