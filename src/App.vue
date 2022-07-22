<template>
  <div class="container center pt-5" v-cloak>
    <div class="card field center">
      <div class="center" @dragover="dragover" @dragleave="dragleave" @drop="drop" v-if="responseRequested">
        <div>
          <input 
            type="file" 
            id="assetsFieldHandle" 
            class="upload-photo center"
            @change="onChange" 
            ref="file" 
            accept=".xls" 
          >
          <label for="assetsFieldHandle" class="input-label">
            Перетащите сюда ваши файлы <strong :class="err ? 'danger' : 'none'">.xls</strong> или <span class="underline primary">кликните тут</span> чтобы загрузить их
          </label>
        </div>
        <div class="card mt-1 list-item file alert" v-if="this.file !== null" >
          {{ file.name }} <button  class="btn danger" type="button" @click="remove">Удалить</button>
        </div>
        <button class="btn primary mt-1" @click="startRequest" :disabled="isDisabled">Начать</button>
      </div>
      <div v-if="showAnimation" class="center">
        <loadingAnimationVue :step='step'/>
      </div>
      <span v-else-if="!responseRequested" class="card center file alert">
        <div class="copy-icon" @click="copy">
         <unicon name="copy" fill="#929292" height="25" width="25" ></unicon>
        </div>
       
        <table v-cloak>
            <thead>
              <th>Полученные данные</th>
            </thead>
            <tr v-for="k of Object.entries(response)" :key="k[0]">
              <span v-if="!k[1].startsWith('http')">
                <td><strong>{{k[0]}}</strong></td>
                <td>{{k[1]}}</td>
              </span>
              <span v-else>
                <td>
                <a :href="k[1]" target="_blank">{{k[0]}}</a>
                </td>
                <td></td>
              </span>
            </tr>
          </table>
      </span>
      <transition name="slide-fade">
        <div v-if="show" class="modal alert primary">
        Скопировано
        </div>
      </transition>
     
    </div>
  </div>
  
</template>

<script> 
import loadingAnimationVue from '@/components/loadingAnimation.vue';


export default {
  name: 'App',
  components: {
    loadingAnimationVue,
  },
  props: {
  },
  data: () => ({
    file: null,
    err: false,
    step: 0,
    showAnimation: false,
    show: false,
    response: {}
  }),
  methods: {
    onChange() {
      let newFile = this.$refs.file.files;
      if (!newFile) {
        return
      }

      newFile = newFile[0]

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
      event.preventDefault()
      event.currentTarget.style.opacity = 1
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange();
      this.dragleave(event)
    },
    handleFileName(name) {
      if (name.length >= 14) {
        return name.slice(11) + '...'
      } else {
        return name
      }
    },
    startRequest(event) {
      event.preventDefault()
      this.showAnimation = true

      new Promise(
        resolve => setTimeout(
          () => {
              this.step++
              resolve()
          }, 1000)
      ).then(() => new Promise(
        resolve => setTimeout(
          () => {
              this.step++
              resolve()
          }, 2000)
      )).then(() => new Promise(
        resolve => setTimeout(
          () => {
              this.step++
              resolve()
          }, 2500)
      )).then(() => new Promise(
        resolve => setTimeout(
          () => {
              this.step++
              resolve()
          }, 500)
      )).then(() => new Promise(
        resolve => setTimeout(
          () => {
              this.step++
              resolve()
          }, 1000)
      )).then(() => {
          this.showAnimation = false
          this.response = {
            'Имя': 'Александр',
            'Фамилия': 'Табольский',
            'Возраст': '17',
            'Ссылка на вк': 'https://vk.com/im?v=',
            'Возраст2': '17',
            'Ссылка на вк222': 'https://vk.com/im?v=',
            'Возраст3': '17',
            'Ссылка на в33к': 'https://vk.com/im?v='
          }
      })
    },
    copy(event) {
      event.preventDefault()
      let txt = '{\n'
      for (let item of Object.entries(this.response)) {
        let [k, v] = item;
        txt += `\t"${k}": "${v}",\n`
      }
      txt += '}'
  
      navigator.clipboard.writeText(txt)
      this.show = true

      setTimeout(() => {this.show = false}, 3000)
    }
  },
  computed: {
    isDisabled() {
      return this.file == null || this.showAnimation || !this.response
    },
    responseRequested() {
      return !Object.keys(this.response).length && !this.showAnimation
    }
   
  },
  watch: {
    showAnimation() {
      return this.file !== null & this.response === null
    },

    
  },

}
</script>

