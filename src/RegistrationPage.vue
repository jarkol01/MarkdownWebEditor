<script lang="ts" setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const processing = ref(false)
const email = ref('')
const password = ref('')
const successMessage = ref(null)
const errorMessage = ref(null)

const register = async () => {
  processing.value = true
  errorMessage.value = null
  successMessage.value = null
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    successMessage.value = 'Account created successfully, redirecting...'
    redirectAfterDelay()
  } catch (error) {
    console.error('Error creating user:', error)
    errorMessage.value = error.message
  }
  processing.value = false
}

const redirectAfterDelay = () => {
  setTimeout(() => {
    location.href = '/editor'
  }, 5000)
}
</script>

<template>
  <div class="min-h-svh flex justify-center items-center">
    <div class="sm:bg-base-200 p-3 sm:p-6 flex flex-col gap-6 rounded-2xl">
      <div>
        <img src="/logo.svg" alt="Logo" class="w-16 sm:mx-auto mb-4" />
        <h1 class="text-2xl font-semibold mb-3 sm:text-center">Create a new account</h1>
        <p>
          Create an account to access the full functionality of the app.
        </p>
      </div>
      <form @submit.prevent="register" class="flex flex-col gap-5">
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
            <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input type="text" class="grow" placeholder="Email" v-model="email" required
                 :disabled="processing || successMessage" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
            <path fill-rule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clip-rule="evenodd" />
          </svg>
          <input type="password" class="grow" placeholder="Password" v-model="password" required
                 :disabled="processing || successMessage" />
        </label>
        <button type="submit" class="btn btn-primary" :disabled="processing || successMessage">
          <span class="loading loading-spinner loading-xs" v-if="processing"></span>
          Register
        </button>
      </form>
      <div role="alert" class="alert alert-success rounded-lg flex text-left" v-if="successMessage">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ successMessage }}</span>
        <span class="loading loading-dots loading-xs"></span>
      </div>
      <div role="alert" class="alert alert-error rounded-lg flex text-left" v-if="errorMessage">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>