<script setup>
import { useStore } from 'vuex'

const store = useStore()

const selectNote = () => {
  store.commit('setSelectedNoteId', props.id)
  console.log('Selected note:', store.getters.selectedNoteId)
}

const props = defineProps({
  id: String,
  title: String
})

</script>

<template>
  <li>
    <RouterLink
      :to="'/editor/' + props.id"
      class="btn btn-ghost font-normal text-left block opacity-75 content-center"
      @click="selectNote"
    >
      {{ props.title }}
    </RouterLink>
  </li>
</template>