<script setup lang="ts">
import SignInWithEmail from '@/components/auth/SignInWithEmail.vue'
import SignInWithGoogle from '@/components/auth/SignInWithGoogle.vue'
import SignInWithFacebook from '@/components/auth/SigninWithFacebook.vue'
import { ref } from 'vue'

const loginModal = ref(null)

const closeModal = () => loginModal.value.close()
</script>
<template>
  <button class="btn" onclick="login_modal.showModal()">Log in</button>
  <dialog id="login_modal" class="modal modal-bottom sm:modal-middle" ref="loginModal">
    <div class="modal-box">
      <p class="text-xl font-bold mb-6 text-center">Log in</p>
      <div class="flex flex-col w-full border-opacity-50">
        <div class="grid sm:grid-cols-2 gap-6">
          <SignInWithGoogle />
          <SignInWithFacebook />
          <RouterLink
            :to="'/register/'"
            class="btn btn-ghost border-base-content/25 hover:border-base-content"
          >
            Sign up with email
          </RouterLink>
        </div>
        <div class="divider my-6">OR</div>
        <SignInWithEmail @sign-in-successful="closeModal" />
      </div>
      <div class="modal-action">
        <form method="dialog" class="w-full">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn w-full">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
