<template>
    
    <div class="input-right full_width">
        <div>
            <strong class="mr-1">
                Задолженности и оплаты
            </strong>
            <div class="row mt-1">
                <iconedButton   
                    @click="$emit('modalSwitchCall')" 
                    icon_name="copy" 
                    color="primary"
                    title="Вставить данные из буфера"
                    class="mr-1"
                />

                <iconedButton   
                    @click="store.addDebt()" 
                    icon_name="plus" 
                    color="primary"
                    title="Добавить долг"
                    class="mr-1"
                />

                <iconedButton   
                @click="store.addPayment()" 
                icon_name="plus" 
                color="primary"
                title="Добавить начисление"
            />
        </div>
        
        </div>
        <div class="row mt-1" v-if="store.allPaymentsAndDebts.length !== 0">
            <div style="width: 42px; margin-right: 3px;"></div>
            <div class="plain input-head-section">Начало просрочки</div>
            <div class="plain input-head-section">Сумма</div>
        </div>

        <div  
            
            v-for="item, index in store.allPaymentsAndDebts" 
           
            :key="item.id" 
            class="row"
            style="margin-bottom: 3px"
        >

            <DebtRow :id="item.id" :index="index" v-if="store.objectIsDebt(item) && (filter === 'all' || filter === 'debt')"/>
            <paymentRow :id="item.id" :index="index" v-else-if="filter === 'all' || filter === 'payment'"/>
        </div>
        <div v-if="store.allPaymentsAndDebts.length === 0" class="row plain mt-1">
            Вы еще не добавили записи...
        </div>
        
    </div>
    <!-- <div class="input-right" style="align-items: center; justify-content: center;">
        <iconedButton   
            @click="store.addDebt()" 
            icon_name="plus" 
            color="primary"
            title="Добавить долг"
        />

        <iconedButton   
            @click="store.addPayment()" 
            icon_name="plus" 
            color="primary"
            title="Добавить начисление"
        />
        <span class="plain">Здесь нет никаких записей...</span>
    </div> -->
</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import DebtRow from './debtRow/debtRow.vue';
import iconedButton from '../iconed_button/iconedButton.vue';
import paymentRow from './paymentRow/paymentRow.vue';
import { ref } from 'vue';


export default {
    name: 'debts_n_paymentsSection',
    components: {
        DebtRow,
        paymentRow,
        iconedButton
    },
    setup() {
        const store = useInputStore()
        return {
            store,
            filter: ref('all')
        }
    },
    computed: {

    }
}


</script>