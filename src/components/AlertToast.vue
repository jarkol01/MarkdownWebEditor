<script lang="ts" setup>
defineProps({
  message: String,
  type: String
})
</script>

<template>
  <div class="toast" v-if="message">
    <div class="alert" :class="`${type}`">
      <span>{{ message }}</span>
    </div>
  </div>
</template>
