<script setup>

import { auth, db } from '@/firebase.js'
import { collection, addDoc } from 'firebase/firestore'
import { useStore } from 'vuex'
import router from '@/router.js'
const emit = defineEmits(['selectNote'])

const store = useStore()

const createNewNote = async () => {
  const docRef = await addDoc(collection(db, 'notes'), {
    title: 'New Note',
    content: '# My New Note',
    user: auth.currentUser.uid
  })
  console.log("Document written with ID: ", );
  store.commit('setSelectedNoteId', docRef.id)
  emit('selectNote')
  router.push(/editor/ + docRef.id)
}
</script>

<template>
  <button class="btn btn-square" @click="createNewNote">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m-6-6h12" />
    </svg>
  </button>
</template>