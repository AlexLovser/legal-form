<template>
    <div class="card alert result-field column">
      <div class="copy-field">
        <button class="btn primary" @click="copy">
         <unicon :name="showCopied ? 'check' : 'copy'" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon> 
         {{ showCopied ? 'Copied!' : 'Copy'}}
        </button>
      </div>
        
        
        <div class="table-field"  v-for="item of store.response.result" :key="item.id">

          <h3>Задолженность возникшая {{item.start}}</h3>
          <table class="tg">
            <TablePart :item="item"/>
          </table>
        </div>
        <h3>Сумма основного долга: {{store.response.total_debt_amount}} руб.</h3> 
        <h3>Сумма пеней по всем задолженностям: {{store.response.total_penalty}} руб.</h3>
       
      </div>
</template>

<script>
import { useMainStore } from '@/stores/mainStore';
import './resultTable.css';
import TablePart from './tablePart.vue';

export default {
    name: 'resultTable',
    props: ['show'],
    emits: ["alert"],
    components: {
      TablePart
    },
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
      
          this.$copyText(txt)

          this.$emit('alert', {message: 'Результат скопирован в буфер обмена', type: 'primary'})
        }
    }
}


</script>