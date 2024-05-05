<script setup>
getLocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("geolocation is not supported")
  }
  function showPosition(position) {
    console.log(position)
  
}
}

</script>

<template>
    <button @click="getLocation">Test</button>
 
</template>