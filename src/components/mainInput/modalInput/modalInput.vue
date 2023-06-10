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
                            <img src="import-example.png" alt="instruction" class="modal-input-img mt-1">
                            <br>
                            2. Вставьте данные в поле ниже
                            <br>
                            3. Нажмите "Вставить"
                        </p>
                    </div>
                    <div style="{width: 100%}">
                        Добавить долги
                        <textarea 
                            class="modal-input mt-1" 
                            v-model="debts_value"
                        >
                        </textarea>
                    </div>
                    
                    <div style="{width: 100%}">
                        Добавить оплаты
                        <textarea 
                            class="modal-input mt-1" 
                            v-model="payments_value">
                        </textarea>
                    </div>
                    
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
import iconedButton from '../iconed_button/iconedButton.vue';

export default {
    name: 'modalInput',
    props: ['for', 'show'],
    components: {
        iconedButton
    },
    data: () => ({
        debts_value: ref(''),
        payments_value: ref(''),
        
    }),
    methods: {
        handleSubmit() {
            this.$emit('saved', {payments_value: this.payments_value, debts_value: this.debts_value})
            this.payments_value = ''
            this.debts_value = ''
        },
        handleCancel() {
            this.$emit('saved', {payments_value: '', debts_value: ''})
            this.payments_value = ''
            this.debts_value = ''
        },
    },
}

</script>