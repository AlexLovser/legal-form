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
            :previewFormat="format"
            :textInput="true"
            :textInputOptions="{
                enterSubmit: true,
                tabSubmit: true,
                openMenu: true,
                format: format,
                rangeSeparator: '.',
            }"
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
import { DateTime } from 'luxon';
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
        console.log(typeof props.initialDate)

        switch (typeof props.initialDate) {
            case String:
                console.log(DateTime.fromISO(props.initialDate))
                date = DateTime.fromISO(props.initialDate)
                break

            case Date:
                console.log(DateTime.fromISO(props.initialDate))
                date = DateTime.fromJSDate(props.initialDate)
                break

            default:
                date = DateTime.now()
        }

        date = ref(date.toISO())

        return {
            monthPicker,
            date,
        }
    },
    computed: {
        highlightDate() {
            return !this.monthPicker && DateTime.fromISO(this.date).invalid !== null
        }
    },
    watch: {
        date(newOne) {
            // newOne = DateTime.fromISO(newOne)
            this.$emit('dateInput', newOne)
        }
    }
}


</script>
  