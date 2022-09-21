<template>
    <td class="indexing plain" style="width: 42px; height: 42px">
        {{index + 1}}
    </td>
    <td>
        <dateInputVue 
            format="dd.MM.yyyy"
            :initialDate="item.debt_start"
            @date-input="newValue => item.debt_start = newValue" 
        />

    </td>
    <td>
        <input 
            :style="{'border-color': !handleAmount() ? '#e53935': '#ccc'}"
            placeholder="сумма долга"
            v-model="item.amount"
            @keypress="isNumber"
            @keypress.enter="store.addDebt"
            required
        />

    </td>
    
    <td v-if="item.id === store.allDebts.at(-1).id" @click="store.addDebt">
        <unicon name="enter" fill="#3eaf7c"></unicon>
    </td>
    <td v-else @click="store.deleteDebt(item.id)">
        <unicon name="trash-alt" fill="#e53935"></unicon>
    </td>

    <td v-if="item.file !== undefined" :title="item.file">
        <unicon name="file-check" fill="#42b983"></unicon> 
    </td>
    <td v-else>

    </td>
</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import dateInputVue from '../dateInput/dateInput.vue';


export default {
    name: 'debtRow',
    components: {
        dateInputVue,
    },
    props: ['index', 'id'],
    setup(props) {
        const store = useInputStore();
        const item = store.allDebts.find(el => el.id === props.id)

        return {
            item,
            store,
        }
    },
    methods: {
        handleAmount() {
            return !isNaN(this.item.amount) && this.item.amount !== ''
        },
        isNumber(event) {
            const isNumber = this.store.isNumber(event, this.item.amount)
            if (isNumber) { 
                return isNumber
            }
        }

    },
}




</script>