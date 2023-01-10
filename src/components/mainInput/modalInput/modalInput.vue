<template>
    <div class="modal-mask" v-if="show">
        <transition name="slide-fade">
            <div class="modal column">
                <div class="row">
                    <div class="modal-description">
                        <p>
                            <strong>Инструкция</strong> 
                            <br>
                            1. Скопируйте данные из редактора (как на рисунке).
                            Обратите внимание на порядок колонок: дата, сумма
                            <br>
                            2. Вставьте данные в поле ниже
                            <br>
                            <img src="import-example.png" alt="instruction" class="modal-input-img mt-1">
                            <br>
                            3. Нажмите "Вставить"
                        </p>
                    </div>
                    <textarea class="modal-input mt-1" v-model="value"></textarea>
                </div>
                <div class="row mt-1">
                    <iconedButton   
                        @click="handleSubmit" 
                        color="primary"
                        title="Сохранить"
                        style="{margin-right: 1rem}"
                    />
                    &nbsp;&nbsp;&nbsp;
                    <iconedButton   
                        @click="handleCancel" 
                        color="danger"
                        title="Отмена"
                    />
                </div>
               
            </div>
        </transition>
    </div>

</template>


<script>
import './modalInput.css';
import { ref } from 'vue';
import { useMainStore } from '@/stores/mainStore';
import iconedButton from '../iconed_button/iconedButton.vue';

export default {
    name: 'modelInput',
    props: ['for', 'show'],
    components: {
        iconedButton
    },
    setup() {
        const value = ref('')
        const store = useMainStore()
       
        return {
            value,
            store
        }
    },
    methods: {
        handleSubmit() {
            this.$emit('saved', this.value)
            this.value = ''
        },
        handleCancel() {
            this.$emit('saved', '')
            this.value = ''
        },
    }
}

</script>