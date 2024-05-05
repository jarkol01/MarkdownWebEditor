<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost">
      Log In
    </div>
    <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-100 rounded-box w-104">
      <SignInWithEmail />
      <div class="text-center m-2">or...</div>
      <SignInWithGoogle />
      <RouterLink
        :to="'/register/'"
        class="font-normal block opacity-75 content-center text-center text-sm text-slate-500 m-1 underline"
      >
        I don't have an account yet
      </RouterLink>
    </ul>
  </div>
</template>
<script setup lang="ts">
import SignInWithEmail from '@/components/Auth/SignInWithEmail.vue'
import SignInWithGoogle from '@/components/Auth/SignInWithGoogle.vue'
</script>