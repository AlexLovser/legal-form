<template>
    <div class="indexing plain mr debt-color">
        {{index + 1}}
    </div>
    <div class="mr">
        <dateInputVue  
            format="dd.MM.yyyy"
            :initialDate="item.debt_start"
            @date-input="newValue => item.debt_start = newValue" 
        />

    </div>
    <div class="mr">
        <input 
            :style="{'border-color': !amountIsValid ? '#e53935': '#ccc'}"
            placeholder="сумма долга"
            v-model="item.amount"
            @keypress="isNumber"
            @keypress.enter="store.addDebt(item)"
            required
        />

    </div>
    
    <!-- <div @click="store.addDebt(item)" class="icon">
        <unicon name="enter" fill="#3eaf7c"></unicon>
    </div> -->
    <div style="{display: flex; width: 172px;}"></div>
    <div @click="store.deleteDebt(item)" class="icon">
        <unicon name="trash-alt" fill="#e53935" height="30" width="30"></unicon>
    </div>

    <div v-if="item.file !== undefined" :title="item.file" class="icon">
        <unicon name="file-check" fill="#42b983" height="27" width="27"></unicon> 
    </div>

</template>


<script>
import { useInputStore } from '@/stores/inputStore';
import dateInputVue from '../../dateInput/dateInput';
import './debtRow.css';


export default {
    name: 'debtRow',
    components: {
        dateInputVue,
    },
    props: ['index', 'id'],
    setup(props) {
        const store = useInputStore();
        let item = store.mainForm.sequence.find(el => el.id === props.id)

        if (item === undefined) {
            item = store.mainForm.imported[0].debts.find(el => el.id === props.id)
        } 

        return {
            item,
            store,
        }
    },
    methods: {
        isNumber(event) {
            const isNumber = this.store.isNumber(event, this.item.amount)
            if (isNumber) { 
                return isNumber
            }
        }
    },

    computed: {
        amountIsValid() {
            return !isNaN(this.item.amount) && this.item.amount !== ''
        }
    },
}




</script>