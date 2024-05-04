<script setup>
import { ref } from 'vue'
import AlertToast from '@/components/AlertToast.vue'

const emit = defineEmits(['recordingStarted', 'recordingStopped'])

const toast = ref({
  message: '',
  type: ''
})

const showToast = (message, type) => {
  toast.value = {
    message,
    type
  }
  setTimeout(() => {
    toast.value = {
      message: '',
      type: ''
    }
  }, 3000)
}

const chunks = ref([])
let currentStream = null
let mediaRecorder = null

// TODO: Use Firebase for storing audio clips
let audioRecordings = ref([])

const startRecording = async () => {
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(currentStream)
    mediaRecorder.ondataavailable = e => chunks.value.push(e.data)
    mediaRecorder.start()
    showToast('Recording started', 'alert-success')
    emit('recordingStarted')
  } catch (error) {
    console.error('Error accessing microphone:', error)
  }
}

const stopRecording = async () => {
  await mediaRecorder.stop()
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop())
    currentStream = null
  }

  const name = prompt('Enter a name for your sound clip?', `Audio recording (${new Date().toLocaleString()})`)
  const blob = new Blob(chunks.value, { type: mediaRecorder.mimeType })
  const url = window.URL.createObjectURL(blob)
  audioRecordings.value.push({ name, blob, url })

  chunks.value = []

  showToast('Recording stopped', 'alert-success')
  emit('recordingStopped')

  // chunks.value = []

  //
  // await mediaRecorder.stop()
  //
  // const clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip')
  //
  // // Save the audio clip to the clips array
  // const blob = new Blob(chunks.value, { type: mediaRecorder.mimeType })
  // clips.value.push({ name: clipName || 'My unnamed clip', blob })
  //
  // chunks.value = []
  showToast('Recording stopped', 'alert-info')
  emit('recordingStopped')
}

// Clips storage

// const onSuccess = (stream) => {
//   currentStream = stream
//   const mediaRecorder = new MediaRecorder(currentStream)
//
//   mediaRecorder.ondataavailable = function(e) {
//     chunks.value.push(e.data)
//   }
//
//   const recordButton = document.querySelector('.start-record')
//   const stopButton = document.querySelector('.stop')
//
//   recordButton.disabled = true
//   stopButton.disabled = false
//
//   mediaRecorder.start()
//   recordButton.style.background = 'yellow'
//   console.log('Recorder started.')
//
//   stopButton.onclick = function() {
//     mediaRecorder.stop()
//     recordButton.style.background = ''
//     console.log(mediaRecorder.state)
//     console.log('Recorder stopped.')
//
//     recordButton.disabled = false
//     stopButton.disabled = true
//   }
//
//   mediaRecorder.onstop = function(e) {
//     console.log('Last data to read (after MediaRecorder.stop() called).')
//
//     const clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip')
//
//     const clipContainer = document.createElement('article')
//     const clipLabel = document.createElement('p')
//     const audio = document.createElement('audio')
//     const deleteButton = document.createElement('button')
//
//     clipContainer.classList.add('clip')
//     audio.setAttribute('controls', '')
//     deleteButton.textContent = 'Delete'
//     deleteButton.className = 'delete'
//
//     clipLabel.textContent = clipName || 'My unnamed clip'
//
//     clipContainer.appendChild(audio)
//     clipContainer.appendChild(clipLabel)
//     clipContainer.appendChild(deleteButton)
//
//     const soundClips = document.querySelector('.sound-clips')
//     soundClips.appendChild(clipContainer)
//
//     audio.controls = true
//     const blob = new Blob(chunks.value, { type: mediaRecorder.mimeType })
//     chunks.value = []
//     const audioURL = window.URL.createObjectURL(blob)
//     audio.src = audioURL
//
//     deleteButton.onclick = function(e) {
//       e.target.closest('.clip').remove()
//     }
//
//     clipLabel.onclick = function() {
//       const existingName = clipLabel.textContent
//       const newClipName = prompt('Enter a new name for your sound clip?')
//       if (newClipName !== null) {
//         clipLabel.textContent = newClipName
//       }
//     }
//   }
// }
//
// const onError = (err) => {
//   console.log('The following error occurred: ' + err)
// }
</script>
<template>
  <dialog id="recorder_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <p class="text-xl font-bold mb-6 text-center">Audio recorder</p>
      <p class="mb-6">
        Here you can record audio clips, which will be later accessible below. Click the start button to begin.
      </p>
      <p class="text-sm text-base-content/50 mb-6">
        <strong>Tip:</strong> You can close this modal while recording and the recording will continue. Open the modal
        again to stop the recording.
      </p>
      <div class="flex gap-3 justify-between">
        <div class="flex gap-3">
          <button
            class="start-record btn btn-primary"
            @click="startRecording"
            :disabled="currentStream !== null"
          >
            Start
          </button>
          <button
            class="stop btn btn-secondary"
            @click="stopRecording"
            :disabled="currentStream === null"
          >
            Stop
          </button>
        </div>
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
      <section>
        <h2 class="text-lg font-bold mt-6">Recorded clips</h2>
        <ul class="list-none p-0 mt-3" v-if="audioRecordings.length">
          <li
            class="mb-6 last:mb-0 p-3 bg-base-200 rounded-xl"
            v-for="audioRecording in audioRecordings"
            :key="audioRecording.name"
          >
            <div class="flex gap-3 justify-between items-center mb-3">
              <p>{{ audioRecording.name }}</p>
              <button
                class="btn btn-ghost btn-xs"
                @click="audioRecordings = audioRecordings.filter(recording => recording !== audioRecording)"
              >
                Remove
              </button>
            </div>
            <audio class="w-full rounded-lg" :src="audioRecording.url" controls></audio>
          </li>
        </ul>
        <p class="mt-3 text-base-content/50" v-else>
          You have no recordings yet.
        </p>
      </section>
    </div>
    <AlertToast :message="toast.message" :type="toast.type" />
  </dialog>
</template>
