<script setup lang="ts">
import { marked } from 'marked'
import { debounce } from 'lodash-es'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import db from '@/firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import NoteList from '@/components/NoteList.vue'
import OCR from './components/OpticalCharacterRecognition.vue'
import AudioRecorder from './components/AudioRecorder.vue'


// Set default initial content
const content = ref('# Edit me...')

// Set markdown to HTML conversion options
marked.use({
  breaks: true
})

// Process raw content to generate the preview
const preview = computed(() => marked(content.value))

// Rate-limit the preview refreshing
const updatePreview = debounce((e) => {
  content.value = e.target.value
}, 50)

// Get noteId from the route params if present
const route = useRoute()
const noteId = route.params.noteId

const store = useStore()
const title = ref('')

// Fetch note data from Firestore
const fetchNote = async () => {
  const docRef = doc(db, 'notes', store.getters.selectedNoteId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    title.value = docSnap.data().title
    content.value = docSnap.data().content
  } else {
    console.log('Document not found!')
  }
}

// If noteId is present, set it as the selected note
if (noteId) {
  store.commit('setSelectedNoteId', noteId)
  fetchNote()
}

// Watch for changes in the selected note
watch(() => store.getters.selectedNoteId, fetchNote)

// Check if the page is viewed on a mobile device and adjust the layout accordingly
const MOBILE_WINDOW_WIDtH_THRESHOLD = 1024
let isMobile = ref(window.innerWidth < MOBILE_WINDOW_WIDtH_THRESHOLD)
const mobileViewMode = ref<'list' | 'editor' | 'preview'>('list')
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < MOBILE_WINDOW_WIDtH_THRESHOLD
})
</script>

<template>
  
  
  <div class="h-svh flex flex-col">
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <img src="../public/logo.svg" alt="Logo" class="w-8 mx-4" />
        <input type="text" placeholder="Note title" class="input w-full max-w-xs" :value="title" />
      </div>
      <div class="flex-none gap-2">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 class="inline-block w-5 h-5 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
            </svg>
          </div>
          <ul tabindex="0" class="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <button onclick="ocr_modal.showModal()">OCR</button>
            </li>
            <li>
              <button onclick="recorder_modal.showModal()">Recorder</button>
            </li>
            <!-- TODO: Other extra functionalities may be launched from here -->
          </ul>
        </div>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-8 rounded-full">
              <img alt="Profile icon" src="./assets/img/default-profile-icon.svg" />
            </div>
          </div>
          <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="h-full overflow-auto grid grid-cols-5">
      <div
        class="py-2 col-span-5 lg:col-span-1"
        v-if="!isMobile || mobileViewMode === 'list'"
      >
        <NoteList @select-note="mobileViewMode = 'editor'" />
      </div>
      <div class="grow h-full col-span-5 lg:col-span-4 grid lg:grid-cols-2">
      <textarea
        class="textarea bg-base-200 rounded-none resize-none focus:outline-none focus:border-transparent"
        :class="{ 'rounded-tl-2xl': !isMobile }"
        :value="content"
        @input="updatePreview"
        v-if="!isMobile || mobileViewMode === 'editor'"
      ></textarea>
        <div class="h-full bg-base-300 px-5 overflow-auto"
             v-if="!isMobile || mobileViewMode === 'preview'"
        >
          <div class="preview" v-html="preview"></div>
        </div>
      </div>
    </div>
    <div class="btm-nav sticky" v-if="isMobile">
      <button
        :class="{ active: mobileViewMode === 'list' }"
        @click="mobileViewMode = 'list'"
      >
        List
      </button>
      <button
        :class="{ active: mobileViewMode === 'editor' }"
        @click="mobileViewMode = 'editor'"
      >
        Editor
      </button>
      <button
        :class="{ active: mobileViewMode === 'preview' }"
        @click="mobileViewMode = 'preview'"
      >
        Preview
      </button>
    </div>
  </div>
  <OCR />
  <AudioRecorder/>

  
 
</template>

<style scoped>
.preview * {
  all: revert;
}
</style>
