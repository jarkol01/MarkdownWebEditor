<script setup>
import { ref,  } from 'vue'
import { createWorker } from 'tesseract.js';

const text = ref('');

const performOCR = async(file) => {
    const worker = await createWorker('eng');

 
  
  const { data: { text } } = await worker.recognize(file);
  setText(text);
  await worker.terminate();
};

const setText = (value) => {
  text.value = value;
};
document.addEventListener('DOMContentLoaded', function () {

const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', (e) =>
  renderFile(e.target.files),
);
const renderFile = (files) => {
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    console.log(file.name)
    img.onload = () => {
        document.getElementById('image').src = e.target.result;
    };
    performOCR(file)

    // Upload to Firebase Storage
 /*   var storageRef = firebase.storage().ref();
    var uploadTask = storageRef.child('images/' + file.name).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
      function(snapshot) {
        // You can add code here to handle the upload progress
      }, 
      function(error) {
        // Handle unsuccessful uploads
      }, 
      function() {
        // Handle successful uploads on complete
        // You can get the download URL from the uploadSnapshot
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
      }
    );
    */
  };
  reader.readAsDataURL(file);
};})  

</script>

<template>
<div>
    <input type="file" id="file-input" accept="image/*" />
    <img id="image" />

    
</div>
  <div>
    <p>{{ text }}</p>
  </div>
</template>