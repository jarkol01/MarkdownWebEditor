<script setup>
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps(['id', 'title'])

const selectNote = () => {
  store.commit('setSelectedNoteId', props.id)
  console.log('Selected note:', store.getters.selectedNoteId)
}
</script>

<template>
  <li><a @click="selectNote">{{ props.title }}</a></li>
</template>