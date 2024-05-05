<script setup>
import { ref } from 'vue'
import AlertToast from '@/components/AlertToast.vue'
import { addDoc, collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { deleteObject, getDownloadURL, getStorage, ref as refStorage, uploadBytes } from 'firebase/storage'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ArrowDownTrayIcon, TrashIcon } from '@heroicons/vue/24/outline/index.js'

const storage = getStorage()
const storageReds = []
const db = getFirestore()
const auth = getAuth()

let userId = null
if (auth.currentUser) {
  userId = auth.currentUser.uid
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    userId = user.uid
    loadRecordings()
  }
})

const loadRecordings = async () => {
  if (!auth.currentUser) {
    return
  }

  // Clear the audioRecordings array
  audioRecordings.value = []

  const querySnapshot = await getDocs(query(collection(db, 'Recordings'), where('auth', '==', userId)))
  querySnapshot.forEach((doc) => {

    const data = doc.data()
    const audio = new Audio(data.url)

    audioRecordings.value.push({ name: data.recordingName, audio, url: data.url })
  })
}
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

let audioRecordings = ref([])

const startRecording = async () => {
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(currentStream)
    mediaRecorder.ondataavailable = e => {
      const DEFAULT_RECORDING_NAME = `Recording (${new Date().toLocaleString()})`
      const name = prompt('Enter a name for your sound clip', DEFAULT_RECORDING_NAME)
      const file = new File([e.data], `${name}_${audioRecordings.value.length + 1}.${mediaRecorder.mimeType.split('/')[1]}`, { type: mediaRecorder.mimeType })

      const storageRef = refStorage(storage, name);
      (async () => {
        await uploadBytes(storageRef, file).then(async () => {
          const url = await getDownloadURL(storageRef)
          console.log('Download URL:', url)

          const docRef = await addDoc(collection(db, 'Recordings'), {
            auth: auth.currentUser.uid,
            url: url,
            recordingName: name
          })
          console.log(docRef)
        })
      })()
      storageReds.push(storageRef)
      audioRecordings.value.push({ name: name || DEFAULT_RECORDING_NAME, file, url: URL.createObjectURL(file) })
    }
    mediaRecorder.start()

    navigator.vibrate(10)

    showToast('Recording started', 'alert-success')
    emit('recordingStarted')
  } catch (error) {
    console.error('Error accessing microphone:', error)
    showToast('Microphone is inaccessible', 'alert-error')
  }
}

const stopRecording = async () => {
  await mediaRecorder.stop()
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop())
    currentStream = null
  }

  chunks.value = []

  navigator.vibrate(10)

  showToast('Recording stopped', 'alert-info')
  emit('recordingStopped')
}

const removeRecording = async recording => {
  audioRecordings.value = audioRecordings.value.filter(r => r !== recording)
  console.log(recording.name)
  const storageRef = refStorage(storage, recording.name)
  console.log('Issuing delete command')
  await (async () => {
    await deleteObject(storageRef)
  })()

  // Query for the document that matches the recording name
  const q = query(collection(db, 'Recordings'), where('recordingName', '==', recording.name), where('auth', '==', userId))
  const querySnapshot = await getDocs(q)

  // Delete all matching documents (there should only be one)
  for (const doc of querySnapshot.docs) {
    await deleteDoc(doc.ref)
  }
  navigator.vibrate(10)
  showToast('Recording removed', 'alert-warning')
}
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
              <div class="flex gap-2">
                <a
                  class="btn btn-ghost btn-xs px-1"
                  :href="audioRecording.url"
                >
                  <ArrowDownTrayIcon class="w-4 h-4" />
                </a>
                <button
                  class="btn btn-ghost btn-xs px-1"
                  @click="removeRecording(audioRecording)"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
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
