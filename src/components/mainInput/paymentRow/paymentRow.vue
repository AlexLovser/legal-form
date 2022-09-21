<template>
    <td class="indexing plain" style="width: 42px; height: 42px">
        {{index + 1}}
    </td>
    <td>
        <dateInputVue 
            format="dd.MM.yyyy"
            :initialDate="item.payment_date"
            @date-input="newValue => item.debt_start = newValue" 
        />

    </td>
    <td>
        <input 
        :style="{'border-color': !handleAmount() ? '#e53935': '#ccc'}"
            placeholder="сумма долга"
            v-model="item.amount"
            @keypress="isNumber"
            @keypress.enter="store.addPayment"
            required
        />

    </td>
    <td>
        <dateInputVue 
            format="MM.yyyy"
            :initialDate="item.pay_for"
            @date-input="newValue => item.pay_for = newValue" 
        />

    </td>
    <td v-if="item.id === store.allPayments.at(-1).id" @click="store.addPayment">
        <unicon name="enter" fill="#3eaf7c"></unicon>
    </td>
    <td v-else @click="store.deletePayment(item.id)">
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
    name: 'paymentRow',
    components: {
        dateInputVue,
    },
    props: ['index', 'id'],
    setup(props) {
        const store = useInputStore();
        const item = store.allPayments.find(el => el.id === props.id)

        return {
            item,
            store
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

    }

}

</script>