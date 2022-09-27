<template>
    <div class="input-right" v-if="store.allDebts.length !== 0">
        <div class="row">
            <div style="width: 42px; margin-right: 3px;"></div>
            <div class="plain input-head-section">Дата оплаты</div>
            <div class="plain input-head-section">Сумма</div>
        </div>

        <div 
            v-for="item, index in store.allDebts" 
            :key="item.id" 
            class="row"
            style="margin-bottom: 3px"
        >
            <DebtRow :id="item.id" :index="index"/>
        </div>
        
    </div>
    <div class="input-right" style="align-items: center; justify-content: center;" v-else>
        <button
            class="btn primary row" 
                @click="store.addDebt()">
            <unicon 
                name="plus" 
                fill="#fff" 
                height="25" 
                width="25" 
                style="margin-right: 1rem">
            </unicon> Добавить долг
        </button>
    </div>
</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import DebtRow from './debtRow/debtRow.vue';

export default {
    name: 'debtsSection',
    components: {
    DebtRow
},
    setup() {
        const store = useInputStore()
        return {
            store
        }
    },
}


</script>