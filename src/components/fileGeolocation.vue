<script setup>
import { ref } from 'vue'
const geolocation = ref('')
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("geolocation is not supported")
  }
  function showPosition(position) {
    geolocation.value = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;  
    console.log(geolocation.value)
  }}

</script>
<template>
<dialog id="geolocation_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box"> 
        <button @click="getLocation" class="btn btn-primary">Get Location</button>
        <a>{{ geolocation }}</a>
      </div>
      
  </dialog>
</template>
