<template>
    <div class="form-control">
        <span class="plain">
            Расчёт пени по коммунальным платежам (155 ЖК РФ)
        </span>
        <div class="card alert plain row title">
            <h2>
                Введите параметры задолженности
            </h2>

        </div>

        <table class="fixedheight">
            <tr class="card mt-1">
                <fileInput />
            </tr>

            <tr class="card mt-1">
                <td class="column">
                    <strong>Задолженности [ {{store.allDebts.length}} ]</strong>
                    <div class="alert plain warning"><br />Обычно ежемесячные платежи<br /><br /></div>
                    <div class="alert plain">
                        <br />
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br />
                        <br />
                        <button class="btn primary row">
                            <unicon name="copy" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                            Вставить из буффера
                        </button>
                        <br />
                        {{store.allDebts}}
                    </div>
                </td>
                <td class="cell">
                    <div class="row">
                        <table class="inner-table">
                            <tr>
                                <td></td>
                                <td class="plain">Начало просрочки</td>
                                <td class="plain">Сумма</td>
                                <td class="plain"></td>

                            </tr>
                            <tr v-for="item, index in store.allDebts" :key="item.id">
                                <debtRowVue :id="item.id" :index="index"/>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>

            <tr class="card mt-1">
                <td class="column">
                    <strong>Процентная ставка</strong>
                </td>
                <td class="cell">
                    <select v-model="store.mainForm.rate">
                        <option value="0">По периодам действия ставки рефинансирования</option>\
                        <option value="1">Конец периода</option>
                        <option value="2">День частичной оплаты</option>
                        <option value="3">День подачи иска в суд (сегодня)</option>
                        <option value="4">Указанную дату</option>
                    </select>
                    <span v-if="store.mainForm.rate === '4'">
                        <dateInputVue 
                            style="margin-top: 1rem"
                            format="dd.MM.yyyy"
                            :initialDate="new Date()"
                            @date-input="newValue => store.mainForm.exactDate = newValue" 
                        />
                    </span>

                </td>
            </tr>

            <tr class="card mt-1">
                <td>
                    <strong>Конечная дата</strong>
                    <div class="alert plain">
                        <br />
                        Текущая дата (по умолчанию)
                        <br />
                        <br />
                    </div>
                </td>
                <td class="row cell">
                    <dateInputVue 
                        format="dd.MM.yyyy"
                        :initialDate="new Date()"
                        @date-input="newValue => store.mainForm.endDate = newValue" 
                    />
                </td>
            </tr>

            <tr class="card mt-1">
                <td class="column">
                    <strong>Частичная оплата задолженности [ {{store.allPayments.length}} ]</strong>
                    <div class="alert plain">
                        <br />
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br />
                        <br />
                        <button class="btn primary row">
                            <unicon name="copy" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                            Вставить из буффера
                        </button>
                        <br />
                        <br />
                    </div>
                </td>
                <td class="cell">
                    <div class="row" style="align-items: center">
                        <table>
                            <tr>
                                <td></td>
                                <td class="plain">Дата оплаты</td>
                                <td class="plain">Сумма</td>
                                <td class="plain">Месяц (если указан)</td>
                            </tr>

                            <tr v-for="item, index in store.allPayments" :key="item.id">
                                <paymentRow :id="item.id" :index="index"/>
                            </tr>


                        </table>
                    </div>
                </td>
            </tr>

            <tr class="card mt-1">
                <td><strong>Метод расчёта</strong></td>
                <td class="cell">
                    <select v-model="store.mainForm.method">
                        <option value="0">1/300 на весь период к задолженностям, возникшим ранее 01.01.2016</option>
                        <option value="1">1/300 только до 01.01.2016 и редакцию от 01.01.2016 после</option>
                        <option value="2">Редакция от 01.01.2016 с первых дней задолженности</option>
                    </select>
                </td>
            </tr>

            <tr class="card mt-1">
                <td><strong>Вид отчёта</strong></td>
                <td class="cell">
                    <table>
                        <tr>
                            <td style="display: flex; align-items: center">
                                <input value="0" type="radio" name="resultView" v-model="store.mainForm.resultView" required>&nbsp;&nbsp;Обычный
                            </td>

                        </tr>
                        <tr>
                            <td style="display: flex; align-items: center">
                                <input value="1" type="radio" name="resultView" v-model="store.mainForm.resultView" required>&nbsp;&nbsp;Бухгалтерский
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="card mt-1">
                <td>
                    <strong>Подпись при печати</strong>
                    <div class="alert plain">
                        <br />
                        Подпись сайта калькулятора покажет суду расчёт со знакомого сайта
                        <br />
                        <br />
                    </div>
                </td>
                <td class="cell">
                    <div class="row" >
                        <input type="checkbox" v-model="store.mainForm.signWhilePrint" style="min-height: auto;" required>&nbsp;&nbsp;
                        Подпись сайта калькулятора расчёта при печати
                    </div>
                </td>
            </tr>
        </table>
        <br>
        <hr class="plain" />
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
        <hr class="plain">
    </div>
</template>

<script>
import './mainInput.css';
import fileInput from './fileInput/fileInput'
import dateInputVue from './dateInput/dateInput.vue';
import debtRowVue from './debtRow/debtRow.vue';
import paymentRow from './paymentRow/paymentRow.vue';
import { useInputStore } from '@/stores/inputStore';


export default {
    name: 'mainInput',
    components: {
        fileInput,
        dateInputVue,
        debtRowVue,
        paymentRow
    },

    setup() {
        const store = useInputStore();
        return {
            store
        };

    },

    methods: {
        async handleAddFile(newFile) {
            try {
                await this.store.addFile(newFile);
                console.log(111)
                this.$emit(
                    'alert',
                    {
                        message: `Данные из файла ${newFile.name} успешно импортированы!`,
                        type: 'primary'
                    }
                );
                console.log(222)
            }
            catch {
                this.$emit('alert', { message: 'Невалидный файл, попробуйте скачать образец ниже', type: 'danger' })
            }
            

        },
        deepClone(value) {
            return JSON.parse(JSON.stringify(value))
        },
        submitForm() {
            const myForm = this.deepClone(this.store.mainForm)
            myForm.debts = this.deepClone(this.store.allDebts)
            myForm.payments = this.deepClone(this.store.allPayments)

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
                this.store.allPayments.length &&
                this.store.mainForm.rate &&
                this.store.mainForm.endDate &&
                this.store.mainForm.method
            )
        },
       
    },
}

</script>