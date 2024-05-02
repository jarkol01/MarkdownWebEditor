<script setup lang="ts">
import { marked } from 'marked'
import { debounce } from 'lodash-es'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import db from '@/firebase.js'
import { doc, getDoc } from "firebase/firestore";
import NoteList from '@/components/NoteList.vue'

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
console.log(noteId)

const store = useStore()
const title = ref("")

// Fetch note data from Firestore
const fetchNote = async () => {
  const docRef = doc(db, "notes", store.getters.selectedNoteId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    title.value = docSnap.data().title
    content.value = docSnap.data().content
  } else {
    console.log("No such document!");
  }
}

// If noteId is present, set it as the selected note
if (noteId) {
  store.commit('setSelectedNoteId', noteId)
  fetchNote()
}

// Watch for changes in the selected note
watch(() => store.getters.selectedNoteId, fetchNote)
</script>

<template>
  <div class="flex h-full overflow-auto">
    <div class="py-1">
      <NoteList />
    </div>
    <div class="grow h-full grid grid-cols-2">
      <textarea
        class="textarea bg-base-200 rounded-none resize-none rounded-tl-2xl focus:outline-none focus:border-transparent"
        :value="content"
        @input="updatePreview"
      ></textarea>
      <div class="h-full bg-base-300 px-4 overflow-auto">
        <div class="preview" v-html="preview"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview * {
  all: revert;
}
</style>
