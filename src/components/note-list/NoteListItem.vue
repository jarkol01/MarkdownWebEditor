<script setup>
import { useStore } from 'vuex'
import { deleteDoc, doc } from 'firebase/firestore'
import { TrashIcon } from '@heroicons/vue/24/outline/index.js'
import { db } from '@/firebase.js'

const props = defineProps({
  id: String,
  title: String,
  isSelected: Boolean
})

const emit = defineEmits(['selectNote', 'noteRemoved'])

const store = useStore()

const selectNote = () => {
  store.commit('setSelectedNoteId', props.id)
  emit('selectNote')
}

const deleteNote = () => {
  deleteDoc(doc(db, 'notes', props.id))
  emit('noteRemoved')
}
</script>

<template>
  <li>
    <RouterLink
      :to="'/editor/' + props.id"
      class="btn btn-ghost font-normal text-left opacity-75 content-center flex justify-between pr-2"
      :class="{ 'bg-base-content/10': props.isSelected }"
      @click="selectNote"
    >
      <span>{{ props.title }}</span>
      <button class="btn btn-ghost btn-sm px-2" @click.prevent.stop="deleteNote">
        <TrashIcon class="w-4 h-4" />
      </button>
    </RouterLink>
  </li>
</template>