<template>
    <div class="indexing plain mr">
        {{index + 1}}
    </div>
    <div class="mr">
        <dateInputVue  
            format="dd.MM.yyyy"
            :initialDate="item.payment_date"
            @date-input="newValue => item.payment_date = newValue" 
        />

    </div>
    <div class="mr">
        <input 
            :style="{'border-color': !handleAmount() ? '#e53935': '#ccc'}"
            placeholder="сумма долга"
            v-model="item.amount"
            @keypress="isNumber"
            @keypress.enter="store.addPayment(item.id)"
            required
        />

    </div>
    <div class="mr">
        <dateInputVue 
            format="MM.yyyy"
            :initialDate="item.pay_for"
            @date-input="newValue => item.pay_for = newValue" 
        />

    </div>
    
    <div @click="store.addPayment(item)" class="icon">
        <unicon name="enter" fill="#3eaf7c"></unicon>
    </div>
    <div @click="store.deletePayment(item)" class="icon">
        <unicon name="trash-alt" fill="#e53935" height="30" width="30"></unicon>
    </div>

    <div v-if="item.file !== undefined" :title="item.file" class="icon">
        <unicon name="file-check" fill="#42b983" height="27" width="27"></unicon> 
    </div>

</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import dateInputVue from '../../dateInput/dateInput';

import './paymentRow.css';


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