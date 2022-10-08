<template>
    <thead>
        <tr>
        <th class="cell" rowspan="2">Задолженность</th>
        <th class="cell" colspan="3">Период просрочки</th>
        <th class="cell" rowspan="2">Ставка</th>
        <th class="cell" rowspan="2">Доля <br>ставки</th>
        <th class="cell" rowspan="2">Формула</th>
        <th class="cell" rowspan="2">Пени</th>
        </tr>
        <tr>
        <th class="cell">с</th>
        <th class="cell">по</th>
        <th class="cell">дней</th>
        </tr>
    </thead>

    <tbody v-for="row, index in item.data" :key="String(index)">
        <tr v-if="row.type == 'period'" class="period-row">
            <td class="cell">{{row.amount}} руб.</td>
            <td class="cell">{{row.start}}</td>
            <td class="cell">{{row.stop}}</td>
            <td class="cell">{{row.days}}</td>
            <td class="cell">{{row.percent}}%</td>
            <td class="cell">{{row.rate}}</td>
            <td class="cell">{{row.amount}} x {{row.days}} x {{row.rate}} x {{row.percent}}%</td>
            <td class="cell">{{row.penalty}} руб.</td>
        </tr>
        <tr v-else class="payment-row">
            <td class="cell">-{{row.amount}} руб.</td>
            <td class="cell">{{row.payment_date}}</td>
            <td class="cell" colspan="6">Погашение части долга</td>

        </tr>
    </tbody>


    <button class="file-item" style="margin-top: 1rem" @click="copyTotal">
        Итого: {{item.penalty}} руб.
    </button> 

    
    <div style="height: 3rem"></div>

</template>


<script>

export default {
    name: 'tablePart',
    props: ['item'],
    methods: {
        copyTotal() {
            this.$copyText(`${this.item.penalty} руб.`)
            this.$parent.$emit('alert', {
                message: 'Итог успешно скопирован!',
                type: 'primary'
            })
        }
    }
}

</script>