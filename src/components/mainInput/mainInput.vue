<template>
    <div class="form-control">
        
        <!-- <div class="card alert primary row title">
            <h2>
                Расчёт пени по коммунальным платежам (155 ЖК РФ)
            </h2>
        </div> -->
        <h2 style="margin-left: 1rem">
            Расчёт пеней
        </h2>
        

        <div>
            <!-- <div class="input-field">
                <div class="input-left">
                    <strong>Тип рассчета</strong>
                </div>
                <div class="input-right">
                    <div class="radio-input-field">
                        <input 
                            value="0" 
                            type="radio"
                            name="resultView" 
                            v-model="store.mainForm.resultView" 
                            required
                        > &nbsp;&nbsp;ч.14 ст.155 ЖК РФ
                    </div>
                    <div class="radio-input-field">
                        <input 
                            value="1" 
                            type="radio" 
                            name="resultView" 
                            v-model="store.mainForm.resultView" 
                            required
                        > &nbsp;&nbsp;ч.14.1 ст.155 ЖК РФ
                    </div>
                </div>
            </div> -->

           <div class="input-field">
                <!-- <div class="input-left">
                    <strong>Задолженности и оплаты</strong>
                    <div class="alert plain warning">
                        <br />
                        Обычно ежемесячные платежи
                        <br />
                        <br />
                    </div>
                    <div class="alert plain">
                        <br />
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br>
                        <br />

                        <iconedButton   
                            @click="debtModalSwitch('open')" 
                            icon_name="copy" 
                            color="primary"
                            title="Вставить задолженности из буфера"
                        />
                        <br />
                        <br />

                        <iconedButton   
                            @click="store.addDebt()" 
                            icon_name="plus" 
                            color="primary"
                            title="Добавить долг"
                        />
                        <br />
                        <br />

                        <iconedButton   
                            @click="store.addPayment()" 
                            icon_name="plus" 
                            color="primary"
                            title="Добавить начисление"
                        />



                        <br />
                    </div>
                </div> -->
                
                <debts_n_payments @modal-switch-call="modalSwitch('open')"/>
           </div>
<!-- 
           <div class="input-field">
                <div class="input-left" >
                    <strong>Частичная оплата задолженности [ {{store.allPayments.length}} ]</strong>
                    <div class="alert plain">
                        <br />
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br />
                        <br />
                        <iconedButton   
                            @click="paymentModalSwitch('open')" 
                            icon_name="copy" 
                            color="primary"
                            title="Вставить начисления из буфера"
                        />
                        <br />
                        <br />
                    </div>
                </div>
                <paymentsVue />
            </div> -->

            <div class="input-field">
                <fileInput />
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
                        style="margin-top: 1rem; width: 170px;"
                        format="dd.MM.yyyy"
                        :initialDate="now"
                        @date-input="newValue => store.mainForm.exactDate = newValue" 
                    />
                </div>
            </div>

            <div class="input-field">
                <div class="input-left">
                    <strong>Конечная дата</strong>
                    <!-- <div class="alert plain">
                        <br />
                        Текущая дата (по умолчанию)
                        <br />
                        <br />
                    </div> -->
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

            <!-- <div class="input-field">
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
            </div> -->

            <!-- <div class="input-field">
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
            </div> -->

            <div class="final-buttons-field">
                <iconedButton   
                    @click="submitForm" 
                    icon_name="bolt-alt" 
                    color="primary"
                    title="Рассчитать"
                    style="{ margin-right: 1rem;}"
                />

                <iconedButton   
                    @click="store.clearForm" 
                    icon_name="redo" 
                    color="danger"
                    title="Очистить"
                />
            </div>

            <modalInput @saved="handlePaste" for="debts" :show="showModal"/>
        </div>
    </div>
</template>

<script>
import './mainInput.css';
import fileInput from './fileInput/fileInput'
import dateInputVue from './dateInput/dateInput.vue';

import debts_n_payments from './debts_paymens/debts_n_payments.vue';
import modalInput from './modalInput/modalInput.vue';
import iconedButton from './iconed_button/iconedButton.vue';

import { DateTime } from "luxon";
import { ref } from 'vue';

import { useInputStore } from '@/stores/inputStore';


export default {
    name: 'mainInput',

    components: {
        fileInput,
        dateInputVue,
        debts_n_payments,
        modalInput,
        iconedButton
    },
    emits: ['submit', 'alert'],

    setup() {
        const store = useInputStore();
        return {
            store,
            now: DateTime.now().toJSDate(),
            showModal: ref(false),
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


        modalSwitch(to) {
            this.showModal = to === 'open'
        },

        handlePaste(data) {
            try {
                this.store.pasteFromClipboard(data)
                this.$emit('alert', {
                    message: 'Данные были успешно добавлены!',
                    type: 'primary'
                });
            } 
            catch (e) {
                this.$emit('alert', {
                    message: 'Данные были некорректны!',
                    type: 'danger'
                });
            } 
            finally {
                this.modalSwitch('close')
            }
            
        },
        deepClone(value) {
            return JSON.parse(JSON.stringify(value))
        },
        
        submitForm() {
            let data = [
                ...this.store.mainForm.sequence
            ]

            if (this.store.mainForm.imported.length !== 0) {
                data.push(...this.store.mainForm.imported[0].debts) 
                data.push(...this.store.mainForm.imported[0].payments)
            }
            const { debts, payments } = this.store.separateToDebtsAndPayments(data)
            
            const myForm = this.deepClone(this.store.mainForm)
            myForm.debts = this.deepClone(debts)
            myForm.payments = this.deepClone(payments)

            let address = ''
            for (let file of myForm.imported) {
                if (file.address !== '' && file.address !== undefined) {
                    address = file.address
                    break
                }
            }
            myForm.address = address

            for (let index in this.store.allPaymentsAndDebts) {
                let element = this.store.allPaymentsAndDebts[index]

                if (this.store.objectIsDebt(element)) {
                    if (element.debt_start === '' || element.amount === '') {
                        index ++
                        this.$emit('alert', {
                            message: `Вы не заполнили до конца задолженность номер ${index}`,
                            type: 'danger',
                        })
                        return
                        
                    }
                }
                else {

                    if (element.payment_date === '' || element.amount === '') {
                        index ++
                        this.$emit('alert', {
                            message: `Вы не заполнили до конца оплату номер ${index}`,
                            type: 'danger',
                        })
                        return
                    }
                    
                }
                
            }


            // for (let index in myForm.debts) {
            //     let debt = myForm.debts[index]
            //     if (debt.debt_start === '' || debt.amount === '') {
            //         index ++
            //         this.$emit('alert', {
            //             message: `Вы не заполнили до конца задолженность номер ${index}`,
            //             type: 'danger',
            //         })
            //         return
                    
            //     }
            // }
            
            // for (let index in myForm.payments) {
            //     let payment = myForm.payments[index]
            //     if (payment.payment_date === '' || payment.amount === '') {
            //         index ++
            //         this.$emit('alert', {
            //             message: `Вы не заполнили до конца оплату номер ${index}`,
            //             type: 'danger',
            //         })
            //         return
            //     }

            // }

            this.store.mainForm.edited = false

            this.$emit(
                'submitForm',
                myForm
            )
        },

    },
    
    computed: {
        isDisabled() {
            const form = this.store.mainForm
            const {debts} = this.store.separateToDebtsAndPayments(this.store.mainForm.sequence)


            return !(
                debts.length &&
                form.rate !== '' &&
                (Number(form.rate) < 4  ? !(form.exactDate in [null, undefined, '']) : true) &&
                form.endDate !== undefined &&
                form.method !== '' &&
                form.edited
            )
        },
       
    },
}

</script>