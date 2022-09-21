<template>
  <hr class="plain"/>
    
    <span class="card alert">
        
        <!-- <div class="copy-icon" @click="copy">
         <unicon name="copy" fill="#929292" height="25" width="25" ></unicon>
        </div>
        -->
        <!-- <table v-cloak >
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

        asdasd

      </span>
</template>

<script>
import { useMainStore } from '@/stores/mainStore';
import './resultTable.css';

export default {
    name: 'resultTable',
    props: ['show'],
    setup() {
      const store = useMainStore()
      return {
        store
      }
    },

    methods: {
        copy() {
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