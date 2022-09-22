<template>
    <div class="card alert result-field column">
        
        <button class="btn primary copy-icon" @click="copy">
         <unicon :name="showCopied ? 'check' : 'copy'" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon> 
         {{ showCopied ? 'Copied!' : 'Copy'}}
        </button>

        <div class="row">
          <div class="same-width column">
            <div v-for="k of Object.keys(store.response)" :key="String(k)">
              <strong>{{k}}</strong>
            </div>

          </div>
          <div class="column same-width">
            <div v-for="v of Object.values(store.response)" :key="String(v)">
              {{v}}
            </div>

          </div>
        </div>
       
        <!-- <table >
            <tr v-for="k of Object.entries(store.response)" :key="k[0]">
              <span v-if="!k[1].toString().startsWith('http')">
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
          </table> -->
      </div>
</template>

<script>
import { useMainStore } from '@/stores/mainStore';
import './resultTable.css';

export default {
    name: 'resultTable',
    props: ['show'],
    emits: ["alert"],
    setup() {
      const store = useMainStore()
      return {
        store,
        showCopied: false
      }
    },

    methods: {
        copy() {
          this.showCopied = true
          setTimeout(() => {
            this.showCopied = false
          }, 2000)
            let txt = '{\n'
            for (let item of Object.entries(this.store.response)) {
                let [k, v] = item;
                txt += `\t"${k}": "${v}",\n`
            }
            txt += '}'
        
            navigator.clipboard.writeText(txt)

            this.$emit('alert', {message: 'Результат скопирован в буффер обмена', type: 'primary'})
        }
    }
}


</script>