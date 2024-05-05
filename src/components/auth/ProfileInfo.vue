<script setup>
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase.js'

const logOut = () => {
  signOut(auth).catch((error) => {
    console.error(error)
  })
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-8 rounded-full">
        <img alt="Profile icon" src="../../assets/img/default-profile-icon.svg" />
      </div>
    </div>
    <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
      <li><a @click="logOut">Logout</a></li>
    </ul>
  </div>
</template>
