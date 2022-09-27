<template>
    <div class="card alert result-field column">
      <div class="copy-field">
        <button class="btn primary" @click="copy">
         <unicon :name="showCopied ? 'check' : 'copy'" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon> 
         {{ showCopied ? 'Copied!' : 'Copy'}}
        </button>
      </div>
        
        
        <div class="table-field">
          
          <h3>Задолженности за 2022</h3>
          <table class="tg">
            <TablePart />
          </table>

          <h3>Задолженности за 2022</h3>
          <table class="tg">
            <TablePart />
          </table>

          <strong>Сумма основного долга: 6 877 434,00 руб.</strong> 
          <br>
          <strong>Сумма пеней по всем задолженностям: 0,00 руб.</strong>
        </div>
       
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
        
            this.$copyText(txt).then(
                e => {
                    alert('Copied')
                    console.log(e)
                }, 
                e => {
                    alert('Can not copy')
                    console.log(e)
                }
            )

            this.$emit('alert', {message: 'Результат скопирован в буфер обмена', type: 'primary'})
        }
    }
}


</script>