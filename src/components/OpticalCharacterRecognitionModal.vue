<script setup>
import { ref } from 'vue'
import { createWorker } from 'tesseract.js'
import AlertToast from '@/components/AlertToast.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection,doc,setDoc,getDoc,query,where,getDocs } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

const ocrState = ref('awaiting-camera-start')
const cameraViewfinder = ref(null)
const resultText = ref('')
const imageSrc = ref(null)
const auth =  getAuth();
const db= getFirestore();
let userId = null

let currentStream = null
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in.
    userId = user.uid
  } else {
    // User is signed out.
    console.log('User is not signed in.');
  }
});

const addData = async () => {
 
console.log("test")
  // Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "OCR_Statistics"), {
    user:  userId,
    timesUsed: 1,
    
  });
  
  console.log("Document written with ID: ", docRef.id);
  const updatedDocSnap = await getDoc(docRef);
   console.log(updatedDocSnap.data());
};
const OCR_Used = async () => {
  const q = query(collection(db, "OCR_Statistics"), where("user", "==", userId));
  const querySnapshot = await getDocs(q);
  console.log(userId)
  
  if (!querySnapshot.empty) {
    const docRef = doc(db, "OCR_Statistics", querySnapshot.docs[0].id);
    const newCount = querySnapshot.docs[0].data().timesUsed + 1;
    await setDoc(docRef, { timesUsed: newCount }, { merge: true });

    const updatedDocSnap = await getDoc(docRef);
    console.log(updatedDocSnap.data());
  } else {
    addData()
  }
};

const toast = ref({
  message: '',
  type: ''
})

const showToast = (message, type) => {
  if (toast.value.message) {
    return
  }
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

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      }
    })
    cameraViewfinder.value.srcObject = stream
    currentStream = stream
    ocrState.value = 'awaiting-capture'
  } catch (error) {
    console.error('Error accessing camera:', error)
    showToast('Camera is inaccessible', 'alert-error')
  }
}

const stopCamera = () => {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => {
      track.stop()
    })
    currentStream = null
    cameraViewfinder.value.srcObject = null
  }
  ocrState.value = 'awaiting-camera-start'
}

const captureImage = () => {
  const canvas = document.createElement('canvas')
  canvas.width = cameraViewfinder.value.videoWidth
  canvas.height = cameraViewfinder.value.videoHeight
  canvas.getContext('2d').drawImage(cameraViewfinder.value, 0, 0)
  imageSrc.value = canvas.toDataURL('image/png')
  stopCamera()
  const imageElement = new Image()
  imageElement.src = imageSrc.value
  performOCR(imageElement)
}

const performOCR = async (file) => {
  ocrState.value = 'processing-image'
  const worker = await createWorker('eng')
  const { data: { text } } = await worker.recognize(file)
  resultText.value = text
  await worker.terminate()
  ocrState.value = 'processing-complete'
  OCR_Used()
}

const retry = () => {
  ocrState.value = 'awaiting-camera-start'
  resultText.value = ''
}

const processExistingImage = (file) => {
  const image = new Image()
  image.src = URL.createObjectURL(file)
  imageSrc.value = image.src
  performOCR(image)
}

const copyResults = () => {
  navigator.clipboard.writeText(resultText.value)
  showToast('Copied to clipboard', 'alert-success')
}
</script>

<template>
  <dialog id="ocr_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <p class="text-xl font-bold mb-6 text-center">Optical character recognition tool</p>
      <div class="flex flex-col w-full border-opacity-50 mb-6">
        <div class="relative">
          <video
            ref="cameraViewfinder"
            class="relative rounded-xl w-full"
            :class="{ hidden: ocrState === 'processing-complete' }"
            autoplay
          ></video>
          <button
            v-if="ocrState === 'awaiting-camera-start'"
            class="btn absolute top-0 w-full h-full flex justify-center items-center"
            @click="startCamera"
          >
            Start camera
          </button>
          <div
            v-if="ocrState === 'processing-image'"
            class="absolute top-0 w-full h-full flex justify-center items-center"
          >
            <span class="loading loading-spinner loading-lg"></span>
          </div>
          <img
            v-if="ocrState === 'processing-image'"
            class="rounded-xl mb-6 absolute top-0 h-full w-full bg-red-50 opacity-25 object-cover"
            alt="Captured image"
            :src="imageSrc"
          />
          <div v-if="ocrState === 'processing-complete'">
            <p class="font-bold mb-3">Result:</p>
            <p>
              {{ resultText }}
            </p>
          </div>
        </div>
        <div v-if="ocrState === 'awaiting-camera-start'">
          <div class="divider">OR</div>
          <input
            type="file"
            class="file-input file-input-bordered w-full"
            accept="image/*"
            @input="processExistingImage($event.target.files[0])"
          />
        </div>
      </div>
      <div class="flex gap-3 justify-between">
        <div class="flex gap-3">
          <button class="btn" @click="captureImage" v-if="ocrState ==='awaiting-capture'">Capture</button>
          <button class="btn" @click="copyResults" v-if="ocrState ==='processing-complete'">Copy</button>
          <button class="btn" @click="retry" v-if="ocrState ==='processing-complete'">Retry</button>
        </div>
        <div class="modal-action mt-0">
          <form method="dialog">
            <button
              class="btn"
              @click="stopCamera"
              :disabled="ocrState === 'processing-image'"
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
    <AlertToast :message="toast.message" :type="toast.type" />
  </dialog>
</template>
