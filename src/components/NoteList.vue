<script setup>
import db from '@/firebase.js'
import { collection, getDocs } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'
import NoteListItem from '@/components/NoteListItem.vue'
import { debounce } from 'lodash-es'

const emit = defineEmits(['select-note'])

const notes = ref([])

onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'notes'))
  querySnapshot.forEach((doc) => {
    notes.value.push({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content
    })
  })
})

const searchQuery = ref('')

const filteredNotes = computed(() => {
  return notes.value.filter((note) => {
    return note.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const filterNotes = debounce((e) => {
  searchQuery.value = e.target.value
}, 50)
</script>

<template>
  <label class="input input-bordered flex items-center gap-2 mx-5">
    <input type="text" class="grow" placeholder="Search" :value="searchQuery" @input="filterNotes" />
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
      <path fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd" />
    </svg>
  </label>
  <ul class="menu flex flex-col gap-2 mt-2">
    <NoteListItem v-for="note in filteredNotes" :key="note.id" :id="note.id" :title="note.title" :search-query @select-note="emit('select-note')" />
  </ul>
</template>
