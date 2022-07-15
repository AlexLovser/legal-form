<template>
  <div class="container center pt-5" v-cloak>
    <div class="card center">
      <div class="center" @dragover="dragover" @dragleave="dragleave" @drop="drop">
        <div v-if="!showAnimation">
          <input 
            type="file" 
            id="assetsFieldHandle" 
            class="upload-photo"
            @change="onChange" 
            ref="file" 
            accept=".xls" 
          >
        
          <label for="assetsFieldHandle" class="cursor-pointer">
              Перетащите сюда ваши файлы <strong :class="err ? 'danger' : 'none'">.xls</strong> или <span class="underline primary">кликните тут</span> чтобы загрузить их
          </label>
        </div>
          <div class="card mt-1 list-item file" v-if="this.file != null">
            {{ file.name }} <button v-if="!showAnimation" class="btn danger" type="button" @click="remove">Удалить</button>
          </div>
        <button class="btn primary mt-1" v-if="!showAnimation" @click="showAnimation=true" :disabled="isDisabled">Начать</button>
      </div>
      <div v-if="showAnimation" class="center">
        <loadingAnimationVue />
      </div>
    </div>
  </div>
  
</template>

<script>

import { response } from 'express';
import loadingAnimationVue from './components/loadingAnimation.vue';

export default {
  name: 'App',
  components: {
    loadingAnimationVue
  },
  props: {
  },
  data: () => ({
    file: null,
    err: false,
    showAnimation: false,
    response: null
  }),
  methods: {
    onChange() {
      let newFile = this.$refs.file.files[0];
      if (newFile.name.endsWith('.xls')) {
        this.file = newFile;
        this.err = false
      } else {
        this.err = true
      }
    },
    remove() {
      this.file = null
    },
    dragover(event) {
      event.preventDefault();
      event.currentTarget.style.opacity = 0.5
    },
    dragleave(event) {
      event.currentTarget.style.opacity = 1
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();
      this.dragleave(event)
    }
  },
  computed: {
    isDisabled() {
      return this.file == null || this.showAnimation
    }
  },
  watch: {
    showAnimation() {
      return this.file !== null & response === null
    }

  }

}
</script>