<script setup>
  import { ref } from 'vue'

  const input = ref('# hello')

  function update(event) {
    input.value = event.target.value
    console.log(input.value)
  }
</script>

<template>
  <div id="editor">
    <!-- Proof of concept, restyle and refactor later -->
    <textarea class="textarea textarea-success resize-none textarea-lg w-[80vw] lg:w-[30vw] h-[80vh]" :value="input" @input="update"></textarea>
  </div>
</template>

<style scoped>
</style>
