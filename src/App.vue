<template>
  <h1>Hello App!</h1>
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/example">Go to Example</RouterLink>
    <RouterLink to="/editor">Go to Editor</RouterLink>
    <NoteList></NoteList>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
<script setup lang="ts">
import NoteList from '@/components/NoteList.vue'
</script>