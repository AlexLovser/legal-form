<template>
    <td class="indexing plain" style="width: 42px; height: 42px">
        {{index + 1}}
    </td>
    <td>
        <dateInputVue 
            format="dd.MM.yyyy"
            @date-input="newValue => item.debt_start = newValue" 
        />

    </td>
    <td>
        <input 
            placeholder="сумма долга"
            v-model="item.amount"
            @keypress="isNumber"
            @keypress.enter="addDebt"
            required
        />

    </td>
    <td v-if="item.id === allDebts.at(-1).id" @click="addDebt">
        <unicon name="enter" fill="#3eaf7c"></unicon>
    </td>
    <td v-else @click="deleteDebt(item.id)">
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
        const { mainForm, allDebts, addDebt, deleteDebt } = useInputStore();
        const item = mainForm.debts.find(el => el.id === props.id)
        console.log(allDebts)

        return {
            mainForm,
            allDebts,
            item,
            deleteDebt,
            addDebt,
        };
    },
    methods: {
        isNumber(event) {
            event = event ? event : window.event
            var charCode = (event.which) ? event.which : event.keyCode
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                event.preventDefault();
            } else {
                return true;
            }
        },

    }

}

</script>