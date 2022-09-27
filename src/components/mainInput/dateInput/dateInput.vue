<template>
    <div :class="highlightDate ? 'dp-error-input': null">
        <Datepicker 
            inputClassName="dp-input"
            menuClassName="dp-menu"
            calendarClassName="dp-calendar"
            calendarCellClassName="dp-calendar-cell"
            :placeholder="monthPicker ? 'мм.гггг': 'дд.мм.гггг'"
            :hideInputIcon="true"
            :monthPicker="monthPicker"
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
        const monthPicker = props.format == 'MM.yyyy'
        let date
        if (monthPicker) {
            date = ref(moment(props.initialDate, props.format))
        } else {
            date = ref(new Date(moment(props.initialDate, props.format)))
        }
        return {
            monthPicker,
            date,
        }
    },
    computed: {
        highlightDate() {
            return !moment(this.date, this.format).isValid()
        }
    },
    watch: {
        date(newOne) {
            this.$emit('dateInput', moment(newOne))
        }
    }
}


</script>
  