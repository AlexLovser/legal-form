<template>
    <div :class="highlightDate ? 'dp-error-input': null">
        <Datepicker 
            inputClassName="dp-input"
            menuClassName="dp-menu"
            calendarClassName="dp-calendar"
            calendarCellClassName="dp-calendar-cell"
            :placeholder="!checkValue ? 'мм.гггг': 'дд.мм.гггг'"
            :hideInputIcon="true"
            :monthPicker="!checkValue"
            :minDate="new Date(2000, 1, 1, 0, 0, 0, 0)"
            :format="format"
            :textInput="true"
            :showNowButton="true"
            nowButtonLabel="Сейчас"
            v-model="date"
            :utc="true"
            autoApply
        />
    </div>

</template>

<script>
   
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import './dateInput.css';
import moment from 'moment';
import {ref} from 'vue';



export default {
    name: 'dateInput',
    props: [
        'initialDate',
        'format'
    ],
    components: {
        Datepicker
    },
    setup (props) {
        return {
            checkValue: props.format !== 'MM.yyyy',
            date: ref(new Date(moment(props.initialDate).add(3, 'hours'))),
        }
    },
    computed: {
        highlightDate() {
            return !moment(this.date).isValid() && this.checkValue
        }
    },
    watch: {
        date(newOne) {
            this.$emit('dateInput', moment(newOne))
        }
    }
}


</script>
  