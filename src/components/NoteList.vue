<script setup>
import db from '@/firebase.js'
import { collection, getDocs } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import NoteListItem from '@/components/NoteListItem.vue'

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
</script>

<template>
  <ul class="menu bg-base-200 w-56 rounded-box">
    <NoteListItem v-for="note in notes" :key="note.id" :id="note.id" :title="note.title" />
  </ul>
</template>