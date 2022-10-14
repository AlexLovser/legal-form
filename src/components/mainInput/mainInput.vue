<template>
    <div class="form-control">
        <span class="plain">
            Расчёт пени по коммунальным платежам (155 ЖК РФ)
        </span>
        <div class="card alert primary row title">
            <h2>
                Введите параметры задолженности
            </h2>
        </div>

        <div>
            <div class="input-field">
                <fileInput />
            </div>

           <div class="input-field">
                <div class="input-left">
                    <strong>Задолженности [ {{store.allDebts.length}} ]</strong>
                    <div class="alert plain warning"><br />Обычно ежемесячные платежи<br /><br /></div>
                    <div class="alert plain">
                        <br />
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br>
                        <br />
                        <button class="btn primary row" @click="handlePasteDebt">
                            <unicon name="copy" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                            Вставить из буфера
                        </button>
                        <br />
                    </div>
                </div>
                <debtsVue />
           </div>

           <div class="input-field">
                <div class="input-left">
                    <strong>Процентная ставка</strong>
                </div>
                <div class="input-right">
                    <select v-model="store.mainForm.rate">
                        <option value="0">По периодам действия ставки рефинансирования</option>\
                        <option value="1">Конец периода</option>
                        <option value="2">День частичной оплаты</option>
                        <option value="3">День подачи иска в суд (сегодня)</option>
                        <option value="4">Указанную дату</option>
                    </select>

                    <dateInputVue 
                        v-if="store.mainForm.rate === '4'"
                        style="margin-top: 1rem; width: 150px;"
                        format="dd.MM.yyyy"
                        :initialDate="now"
                        @date-input="newValue => store.mainForm.exactDate = newValue" 
                    />
                </div>
            </div>

            <div class="input-field">
                <div class="input-left">
                    <strong>Конечная дата</strong>
                    <div class="alert plain">
                        <br />
                        Текущая дата (по умолчанию)
                        <br />
                        <br />
                    </div>
                </div>
                <div class="input-right">
                    <div style="width: 170px">
                        <dateInputVue 
                            format="dd.MM.yyyy"
                            :initialDate="now"
                            @date-input="newValue => store.mainForm.endDate = newValue" 
                        />  
                    </div>
                    
                </div>
            </div>

            <div class="input-field">
                <div class="input-left" >
                    <strong>Частичная оплата задолженности [ {{store.allPayments.length}} ]</strong>
                    <div class="alert plain">
                        <br />
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br />
                        <br />
                        <button class="btn primary row" @click="handlePastePayment">
                            <unicon name="copy" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                            Вставить из буфера
                        </button>
                        <br />
                        <br />
                    </div>
                </div>
                <paymentsVue />
            </div>

            <div class="input-field">
                <div class="input-left">
                    <strong>Метод расчёта</strong>
                </div>
                <div class="input-right">
                    <select v-model="store.mainForm.method">
                        <option value="0">1/300 на весь период к задолженностям, возникшим ранее 01.01.2016</option>
                        <option value="1">1/300 только до 01.01.2016 и редакцию от 01.01.2016 после</option>
                        <option value="2">Редакция от 01.01.2016 с первых дней задолженности</option>
                    </select>
                </div>
            </div>

            <div class="input-field">
                <div class="input-left">
                    <strong>Вид отчёта</strong>
                </div>
                <div class="input-right">
                    <div class="radio-input-field">
                        <input 
                            value="0" 
                            type="radio"
                            name="resultView" 
                            v-model="store.mainForm.resultView" 
                            required
                        > &nbsp;&nbsp;Обычный
                    </div>
                    <div class="radio-input-field">
                        <input 
                            value="1" 
                            type="radio" 
                            name="resultView" 
                            v-model="store.mainForm.resultView" 
                            required
                        > &nbsp;&nbsp;Бухгалтерский
                    </div>
                </div>
            </div>

            <div class="input-field">
                <div class="input-left">
                    <strong>Подпись при печати</strong>
                    <div class="alert plain">
                        <br />
                        Подпись сайта калькулятора покажет суду расчёт со знакомого сайта
                        <br />
                        <br />
                    </div>
                </div>
                <div class="input-right">
                    <div class="row checkbox-input" >
                        <input type="checkbox" v-model="store.mainForm.signWhilePrint" style="min-height: auto;" required>&nbsp;&nbsp;
                        Подпись сайта калькулятора расчёта при печати
                    </div>
                </div>
            </div>

            <div class="final-buttons-field">
                <button class="btn primary row mt-1" @click="submitForm" :disabled="isDisabled">
                    <unicon name="bolt-alt" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                    Рассчитать
                </button>
                <button class="btn danger mt-1" @click="store.clearForm">
                    <unicon name="redo" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                    Очистить
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import './mainInput.css';
import fileInput from './fileInput/fileInput'
import dateInputVue from './dateInput/dateInput.vue';
import paymentsVue from './payments/payments.vue';
import debtsVue from './debts/debts.vue';
import { DateTime } from "luxon";

import { useInputStore } from '@/stores/inputStore';


export default {
    name: 'mainInput',
    components: {
        fileInput,
        dateInputVue,
        paymentsVue,
        debtsVue
    },

    setup() {
        const store = useInputStore();
        return {
            store,
            now: DateTime.now().toJSDate()
        };

    },

    methods: {
        async handleAddFile(newFile) {
            try {
                await this.store.addFile(newFile);
                this.$emit(
                    'alert',
                    {
                        message: `Данные из файла ${newFile.name} успешно импортированы!`,
                        type: 'primary'
                    }
                );
            }
            catch {
                this.$emit('alert', { message: 'Невалидный файл, попробуйте скачать образец ниже', type: 'danger' })
            }
            

        },

        pasteMixin(f) {
            try {
                f()
                this.$emit('alert', {
                    message: 'Данные из буфера обмена были успешно вставлены!',
                    type: 'primary'
                });
            } catch (e) {
                console.log(e)
                this.$emit('alert', {
                    message: 'Данные из буфера обмена были некорректны!',
                    type: 'danger'
                });
            }
        },

        handlePasteDebt() {
            navigator.clipboard.readText().then(
                clipText => {
                    this.pasteMixin(() => this.store.pasteDebtFromClipboard(clipText))
                }
            );
           
        },
        handlePastePayment() {
            navigator.clipboard.readText().then(
                clipText => {
                    console.log(clipText)
                    this.pasteMixin(() => this.store.pastePaymentFromClipboard(clipText))
                }
            );
        },
        
        deepClone(value) {
            return JSON.parse(JSON.stringify(value))
        },
        
        submitForm() {
            
            const myForm = this.deepClone(this.store.mainForm)
            myForm.debts = this.deepClone(this.store.allDebts)
            myForm.payments = this.deepClone(this.store.allPayments)
            console.log('Pre', myForm)

            let address = ''
            for (let file of myForm.imported) {
                if (file.address !== '' && file.address !== undefined) {
                    address = file.address
                    break
                }
            }
            myForm.address = address


            for (let index in myForm.debts) {
                let debt = myForm.debts[index]
                if (debt.debt_start === '' || debt.amount === '') {
                    index ++
                    this.$emit('alert', {
                        message: `Вы не заполнили до конца задолженность номер ${index}`,
                        type: 'danger',
                    })
                    return
                    
                }
            }
            
            for (let index in myForm.payments) {
                let payment = myForm.payments[index]
                if (payment.payment_date === '' || payment.amount === '') {
                    index ++
                    this.$emit('alert', {
                        message: `Вы не заполнили до конца оплату номер ${index}`,
                        type: 'danger',
                    })
                    return
                }

            }

            this.store.mainForm.edited = false

            this.$emit(
                'submitForm',
                myForm
            )
        },
    },
    
    computed: {
        isDisabled() {
            return !(
                this.store.allDebts.length &&
                this.store.mainForm.rate &&
                this.store.mainForm.endDate &&
                this.store.mainForm.method &&
                this.store.mainForm.edited
            )
        },
       
    },
}

</script>