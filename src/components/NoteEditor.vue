<script setup>
  import { ref, watch } from 'vue'
  import { useStore } from 'vuex'
  import { doc, getDoc } from "firebase/firestore";
  import { db } from '@/firebase.js'
  

  const store = useStore()
  const title = ref("")
  const content = ref("")

  function updateContent(event) {
    content.value = event.target.value
  }

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

  watch(() => store.getters.selectedNoteId, fetchNote)
</script>

<template>
  <!-- Proof of concept, restyle and refactor later -->
  <textarea
    class="textarea textarea-success resize-none textarea-lg w-[80vw] lg:w-[30vw] h-[80vh]"
    placeholder="Select a note to edit..."
    :value="content"
    :disabled="!store.getters.isNoteSelected"
    @input="updateContent"
  />
</template>