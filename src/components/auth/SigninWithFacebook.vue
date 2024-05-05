<script setup>
import { getAuth, FacebookAuthProvider , signInWithPopup } from 'firebase/auth'


const provider = new FacebookAuthProvider()

const auth = getAuth();
const signInWithPopupFirebase = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;

      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
    });
}

</script>

<template>
  <div class="flex items-center justify-center">
    <button
      class="btn btn-ghost w-full border-base-content/25 hover:border-base-content"
      @click="signInWithPopupFirebase"
    >
      
      <span>Login with Facebook</span>
    </button>
  </div>
</template>