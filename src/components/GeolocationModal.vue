<script lang="ts" setup>
import { ref } from 'vue'
import AlertToast from '@/components/AlertToast.vue'

const geolocation = ref('')
const state = ref('awaiting-location')
const toast = ref({
  message: '',
  type: ''
})

const showToast = (message, type) => {
  if (toast.value.message) {
    return
  }
  toast.value = {
    message,
    type
  }
  setTimeout(() => {
    toast.value = {
      message: '',
      type: ''
    }
  }, 3000)
}

function getLocation() {
  if (navigator.geolocation) {
    state.value = 'getting-location'
    navigator.geolocation.getCurrentPosition(showPosition, showError)
  } else {
    showToast('Geolocation is not supported', 'alert-error')
  }
}

function showPosition(position) {
  geolocation.value = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`
  state.value = 'location-received'
}

function showError(error) {
  showToast(`Error: ${error.message}`, 'alert-error')
  state.value = 'awaiting-location'
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showToast('Copied to clipboard', 'alert-success')
    })
    .catch(() => {
      showToast('Failed to copy to clipboard', 'alert-error')
    })
}
</script>

<template>
  <dialog id="geolocation_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <p class="text-xl font-bold mb-6 text-center">Geolocation getter</p>
      <p>
        You can get your geographical location by clicking the button below, so you can use it in your notes or other
        applications.
      </p>
      <p class="text-sm text-base-content/50 mt-6" v-if="state === 'location-received'">
        <strong>Tip:</strong> Click on the location to copy it to your clipboard.
      </p>
      <div class="flex flex-col w-full border-opacity-50 mb-6">
        <div v-if="state === 'getting-location'" class="flex justify-center items-center mt-6">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
        <button
          v-if="state === 'location-received'"
          class="btn btn-outline border-dashed border-base-content rounded-lg mt-6 p-4 text-center"
          @click="copyToClipboard(geolocation)"
        >
          {{ geolocation }}
        </button>
      </div>
      <div class="flex gap-3 justify-between">
        <div class="modal-action mt-0 flex justify-between w-full">
          <button class="btn" @click="getLocation" :disabled="state === 'getting-location'">Get location</button>
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </div>
    <AlertToast :message="toast.message" :type="toast.type" />
  </dialog>
</template>
