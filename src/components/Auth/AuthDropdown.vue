<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost">
      Log In
    </div>
    <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-100 rounded-box w-104">
      <SignInWithEmail />
      <SignInWithGoogle />
    </ul>
  </div>
</template>
<script setup lang="ts">
import SignInWithEmail from '@/components/Auth/SignInWithEmail.vue'
import SignInWithGoogle from '@/components/Auth/SignInWithGoogle.vue'
</script>