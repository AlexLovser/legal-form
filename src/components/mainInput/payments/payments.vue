<template>
    <div class="input-right" v-if="store.allPayments.length !== 0">
        <div class="row">
            <div style="width: 42px; margin-right: 3px;"></div>
            <div class="plain input-head-section">Дата оплаты</div>
            <div class="plain input-head-section">Сумма</div>
            <div class="plain input-head-section">Месяц (если указан)</div>
        </div>

        <div 
            v-for="item, index in store.allPayments" 
            :key="item.id" 
            class="row"
            style="margin-bottom: 3px"
        >
            <paymentRow :id="item.id" :index="index"/>
        </div>
        
    </div>
    <div class="input-right" style="align-items: center; justify-content: center;" v-else>
        <iconedButton   
            @click="store.addPayment()" 
            icon_name="plus" 
            color="primary"
            title="Добавить платеж"
        />
    </div>
</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import paymentRow from './paymentRow/paymentRow.vue';
import iconedButton from '../iconed_button/iconedButton.vue';

export default {
    name: 'paymentsSection',
    components: {
        paymentRow,
        iconedButton
    },
    setup() {
        const store = useInputStore()
        return {
            store
        }
    },
    methods: {

    }
}


</script>