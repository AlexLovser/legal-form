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
        <button
            class="btn primary row" 
                @click="store.addPayment()">
            <unicon 
                name="plus" 
                fill="#fff" 
                height="25" 
                width="25" 
                style="margin-right: 1rem">
            </unicon> Добавить платеж
        </button>
    </div>
</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import paymentRow from './paymentRow/paymentRow.vue';


export default {
    name: 'paymentsSection',
    components: {
        paymentRow,
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