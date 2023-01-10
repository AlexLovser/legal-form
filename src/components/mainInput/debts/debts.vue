<template>
    <div class="input-right" v-if="store.allDebts.length !== 0">
        <div class="row">
            <div style="width: 42px; margin-right: 3px;"></div>
            <div class="plain input-head-section">Начало просрочки</div>
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
        <iconedButton   
            @click="store.addDebt()" 
            icon_name="plus" 
            color="primary"
            title="Добавить долг"
        />
    </div>
</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import DebtRow from './debtRow/debtRow.vue';
import iconedButton from '../iconed_button/iconedButton.vue';


export default {
    name: 'debtsSection',
    components: {
    DebtRow,
    iconedButton
},
    setup() {
        const store = useInputStore()
        return {
            store
        }
    },
}


</script>