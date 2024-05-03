<script setup>
import { ref,  } from 'vue'
import { createWorker } from 'tesseract.js';

const text = ref('');

const performOCR = async() => {
    const worker = await createWorker('eng');

 
  
  const { data: { text } } = await worker.recognize('https://i.postimg.cc/C57kKtRy/test.png');
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
    img.onload = () => {
      document.body.appendChild(img);
    };
  };
  reader.readAsDataURL(file);
};})  

</script>

<template>
<div>
    <input type="file" id="file-input" accept="image/*" />

    <button @click="performOCR()">Wczytaj zdjęcie</button>
</div>
  <div>
    <p>{{ text }}</p>
  </div>
</template>