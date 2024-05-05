<script setup>
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const auth = getAuth()
const provider = new GoogleAuthProvider()

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((userCredential) => {
      console.log('User signed in', userCredential.user)
    })
    .catch((error) => {
      console.error(error)
    })
}

</script>

<template>
  <div class="flex items-center justify-center">
    <button
      class="btn btn-ghost w-full border-base-content/25 hover:border-base-content"
      @click="signInWithGoogle"
    >
      <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
      <span>Login with Google</span>
    </button>
  </div>
</template>