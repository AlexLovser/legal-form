<template>
    <div>
        <Datepicker 
            inputClassName="dp-input"
            menuClassName="dp-custom-menu"
            :placeholder="format === 'MM.yyyy' ? 'мм.гггг': 'дд.мм.гггг'"
            selectText="Выбрать"
            nowButtonLabel="Сегодня"
            cancelText="Отмена"
            :noHoursOverlay="true"
            :noMinutesOverlay="true"
            :noSecondsOverlay="true"
            :hideInputIcon="true"
            :monthPicker="format === 'MM.yyyy'"
            :clearable="false"
            :minDate="new Date(2000, 1, 1, 0, 0, 0, 0)"
            :maxDate="new Date()"
            :format="format"
            :previewFormat="format"
            v-model="date"
            utc="+3"
        />
    </div>

</template>

<script>
   
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import './dateInput.css';
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
        date: new Date()
      }
    },
    watch: {
        date(newOne) {
            this.$emit('dateInput', newOne)
        }
    }
}


</script>
  