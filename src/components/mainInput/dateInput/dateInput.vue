<template>
    <div :class="!validDate() ? 'dp-error-input': null">
        <Datepicker 
            inputClassName="dp-input"
            menuClassName="dp-menu"
            calendarClassName="dp-calendar"
            calendarCellClassName="dp-calendar-cell"
            :placeholder="format === 'MM.yyyy' ? 'мм.гггг': 'дд.мм.гггг'"
            :hideInputIcon="true"
            :monthPicker="format === 'MM.yyyy'"
            :minDate="new Date(2000, 1, 1, 0, 0, 0, 0)"
            :maxDate="new Date()"
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
        'format'
    ],
    components: {
        Datepicker
    },
    data () {
      return {
        date: ref(new Date()),
      }
    },
    methods: {
        validDate() {
            return moment(this.date).isValid()
        }
    },
    watch: {
        date(newOne) {
            this.$emit('dateInput', newOne)
        }
    }
}


</script>
  