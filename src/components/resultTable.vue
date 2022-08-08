<template>
    <span class="card center file alert">
        <div class="copy-icon" @click="copy">
         <unicon name="copy" fill="#929292" height="25" width="25" ></unicon>
        </div>
       
        <table v-cloak>
            <thead>
              <th>Полученные данные</th>
            </thead>
            <tr v-for="k of Object.entries(response)" :key="k[0]">
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
          </table>
      </span>
</template>

<script>

export default {
    name: 'resultTable',
    inject: [
        'response',
    ],

    methods: {
        copy() {
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
    }
}


</script>