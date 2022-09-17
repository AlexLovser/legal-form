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
                <td class="column">
                    <strong>Файлы [ {{this.mainForm.imported.length}} / 10 ]</strong>
                    <div class="alert plain">
                        <br />
                        Данные из файлов автоматически добавляются в форму. Удаляя файл вы удаляете его данные из формы
                        <br />
                        <br />
                        <fileInput @fileInput="addFile" :disabled="mainForm.imported.length === 10" />
                        <br />
                        <br />
                    </div>
                </td>
                <td class="cell">
                    <ul class="row" style="list-style-type: none" v-if="this.mainForm.imported.length !== 0">
                        <li v-for="file in mainForm.imported" :key="file.id" class="row">
                            <button class="file-item" style="min-width: 350px">
                                {{file.name}}
                            </button>
                            <button class="file-item" style="background: #e53935; border-color: #e53935;"
                                @click="deleteFile(file.id)">
                                <unicon name="times" fill="#fff"></unicon>
                            </button>
                        </li>
                    </ul>
                    <span v-else class="plain center row">
                        <unicon name="file-slash" fill="#8c8989" height="50" width="50" style="margin-bottom: 1rem">
                        </unicon> Вы еще не добавили ни одного файла...
                    </span>

                </td>
            </tr>

            <tr class="card mt-1">
                <td class="column">
                    <strong>Задолженности [ {{allDebts.length}} ]</strong>
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
                        <br />
                    </div>
                </td>
                <td class="cell">
                    <div class="row">
                        <table class="inner-table">

                            <tr>
                                <td class="plain">Начало просрочки</td>
                                <td class="plain">Сумма</td>
                                <td class="plain"></td>

                            </tr>

                            <tr v-for="item in allDebts" :key="item.id" lazy>
                                <td>
                                    <input @keypress.enter="handleEnter" type="date" placeholder="дд.мм.гггг"
                                        min="2000-01-01" max="2023-01-01" v-model="item.debt_start" required />
                                </td>
                                <td>
                                    <input @keypress="isNumber" @keypress.enter="addDebt" placeholder="сумма долга"
                                        v-model="item.amount" required />
                                </td>
                                <td v-if="item.id === allDebts.at(-1).id" @click="addDebt">
                                    <unicon name="enter" fill="#3eaf7c"></unicon>
                                </td>
                                <td v-else @click="deleteDebt(item.id)">
                                    <unicon name="trash-alt" fill="#e53935"></unicon>
                                </td>
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
                    <select v-model="mainForm.rate">
                        <option value="1">Конец периода</option>
                        <option value="2">По периодам действия ставки рефинансирования</option>
                        <option value="3">День частичной оплаты</option>
                        <option value="4">День подачи иска в суд (сегодня)</option>
                        <option value="5">Указанную дату</option>
                    </select>
                    <span v-if="mainForm.rate === '5'">
                        <input type="date" placeholder="дд.мм.гггг" style="margin-top: 1rem" v-model="mainForm.providedDate">
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
                    <input placeholder="дд.мм.гггг" v-model="mainForm.endDate" min="2000-01-01" max="2023-01-01"
                        required type="date">

                </td>
            </tr>

            <tr class="card mt-1">
                <td class="column">
                    <strong>Частичная оплата задолженности [ {{allPayments.length}} ]</strong>
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
                                <td class="plain">Дата оплаты</td>
                                <td class="plain">Сумма</td>
                                <td class="plain">Месяц (если указан)</td>
                            </tr>

                            <tr v-for="item in allPayments" :key="item.id">
                                <td>
                                    <input type="date" min="2000-01-01" max="2023-01-01" placeholder="дд.мм.гггг"
                                        v-model="item.payment_date" />
                                </td>
                                <td>
                                    <input placeholder="сумма долга" v-model="item.amount" @keypress="isNumber" />
                                </td>
                                <td>
                                    <input type="date" min="2000-01-01" max="2023-01-01" placeholder="мм.гггг"
                                        v-model="item.month" />
                                </td>
                                <td v-if="item.id === allPayments.at(-1).id" @click="addPayment">
                                    <unicon name="enter" fill="#3eaf7c"></unicon>
                                </td>
                                <td v-else @click="deletePayment(item.id)">
                                    <unicon name="trash-alt" fill="#e53935"></unicon>
                                </td>
                            </tr>


                        </table>
                    </div>
                </td>
            </tr>

            <tr class="card mt-1">
                <td><strong>Метод расчёта</strong></td>
                <td class="cell">
                    <select v-model="mainForm.method">
                        <option value="1">1/300 на весь период к задолженностям, возникшим ранее 01.01.2016</option>
                        <option value="2">1/300 только до 01.01.2016 и редакцию от 01.01.2016 после</option>
                        <option value="3">Редакция от 01.01.2016 с первых дней задолженности</option>
                    </select>
                </td>
            </tr>

            <tr class="card mt-1">
                <td><strong>Вид отчёта</strong></td>
                <td class="cell">
                    <table>
                        <tr>
                            <td style="display: flex; align-items: center">
                                <input value="0" type="radio" name="resultView" v-model="mainForm.resultView">&nbsp;&nbsp;Обычный
                            </td>

                        </tr>
                        <tr>
                            <td style="display: flex; align-items: center">
                                <input value="1" type="radio" name="resultView" v-model="mainForm.resultView">&nbsp;&nbsp;Бухгалтерский
                            </td>
                        </tr>
                        {{$refs.resultView}}
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
                    <div class="row">
                        <input type="checkbox" id="sign" v-model="mainForm.signWhilePrint"
                            style="width: 16px; height: 16px">&nbsp;&nbsp;Подпись сайта калькулятора расчёта при печати
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
            <button class="btn danger mt-1" @click="clearForm">
                <unicon name="redo" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                Очистить
            </button>
        </div>
    </div>
</template>

<script>
import './mainInput.css';
import { inject, ref } from 'vue';
import fileInput from './fileInput/fileInput'
const axios = require('axios').default;
import { v4 as uuidv4 } from 'uuid';


export default {
    name: 'mainInput',
    components: {
        fileInput
    },

    setup() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd

        const mainForm = ref({
            endDate: today,
            rate: '1',
            'providedDate': '',
            method: '1',
            'resultView': '0',
            'signWhilePrint': true,
            debts: [
                {
                    id: 0,
                    debt_start: '',
                    amount: ''
                }
            ],
            payments: [
                {
                    id: 0,
                    payment_date: '',
                    amount: '',
                    month: ''
                }
            ],
            imported: [
            ]
        })

        const response = inject('response')
        const showAnimation = inject('showAnimation')

        return {
            mainForm,
            response,
            showAnimation,
        }
    },

    methods: {
        orderDebts() {
        },

        submitForm() {
            const myForm = { ...this.mainForm }

            myForm.debts = this.allDebts
            myForm.payments = this.allPayments
            this.$emit(
                'submitForm',
                myForm
            )
        },

        clearForm() {
            this.mainForm = {
                endDate: '',
                rate: '1',
                method: '1',
                debts: [
                    {
                        id: 0,
                        debt_start: '',
                        amount: ''
                    }
                ],
                payments: [
                    {
                        id: 0,
                        payment_date: '',
                        amount: '',
                        month: ''
                    }
                ],
                imported: this.mainForm.imported
            }
        },

        addFile(newFile) {
            this.extractInformation(newFile).then(
                parsed => {
                    parsed = this.handleData(parsed.data.data)

                    for (let item of parsed.debts) {
                        item.id = uuidv4()
                    }

                    for (let item of parsed.payments) {
                        item.id = uuidv4()
                    }

                    this.mainForm.imported.push(
                        {
                            id: uuidv4(),
                            name: newFile.name,
                            ...parsed,
                        }
                    )

                    this.$emit(
                        'alert',
                        {
                            message: `Данные из файла ${newFile.name} успешно импортированы!`,
                            type: 'primary'
                        }
                    )
                }
            ).catch(
                () => {
                    this.$emit('alert', { message: 'Невалидный файл, попробуйте скачать образец ниже', type: 'danger' })
                }
            )


        },

        async extractInformation(file) {
            return await axios.post(
                'https://cabinet.sk-developer.ru/api/v1/dashboard/parse',
                { file },
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )

        },

        handleData(data) {
            this.step++
            const request = {
                "type": "0",
                "correct_debt_dates": false,
                "rate": 2,
                "method": 2,
                "stop": "01.08.2022",
                "zero_penalty": true,
                "zero_start": "03.04.2020",
                "zero_stop": "01.01.2021",
                "special_rate": true,
                "custom_rate": 0,
            }

            let { debts, payments, address } = data;

            this.address = address


            const dateReformat = string => string.split('.').reverse().join('-')

            debts = debts.map(
                value => {
                    value.debt_start = dateReformat(value.start)
                    return value
                }
            )

            payments = payments.map(
                value => {
                    value.payment_date = dateReformat(value.payment_date)
                    value.part = '1/1'
                    return value
                }
            )

            request.debts = debts
            request.payments = payments

            return request

        },

        deleteFile(id) {
            this.mainForm.imported = this.mainForm.imported.filter(
                item => item.id !== id
            )
        },

        isNumber(event) {
            event = event ? event : window.event
            var charCode = (event.which) ? event.which : event.keyCode
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                event.preventDefault();
            } else {
                return true;
            }
        },

        addDebt() {
            this.mainForm.debts.push(
                {
                    id: uuidv4(),
                    debt_start: '',
                    amount: ''
                }
            )
        },

        deleteDebt(id) {
            this.mainForm.debts = this.mainForm.debts.filter(
                item => item.id !== id
            )
        },

        addPayment() {
            this.mainForm.payments.push(
                {
                    id: uuidv4(),
                    payment_date: '',
                    amount: '',
                    month: ''
                }
            )
        },

        deletePayment(id) {
            this.mainForm.payments = this.mainForm.payments.filter(
                item => item.id !== id
            )
        },

    },
    computed: {
        isDisabled() {
            return !(
                this.allDebts.length &&
                this.allPayments.length &&
                this.mainForm.rate &&
                this.mainForm.endDate &&
                this.mainForm.method
            )
        },
        allDebts() {
            let initial = [...this.mainForm.debts]

            for (let elem of this.mainForm.imported) {
                initial.push(...elem.debts)
            }

            let bothCompleted = []
            let oneIsEmpty = []
            let twoAreEmpty = []
            
            for (let index in initial) {
                let item = initial[index]
                if (item.debt_start !== '' && item.amount !== '') {
                    bothCompleted.push(item)
                } else if (item.debt_start === '' && item.amount === '') {
                    twoAreEmpty.push(item)
                } else {
                    oneIsEmpty.push(item)
                }
            }

            bothCompleted = bothCompleted.sort(
                (a, b) => new Date(a.debt_start) - new Date(b.debt_start)
            )
            
            return [...bothCompleted, ...oneIsEmpty, ...twoAreEmpty]

        },

        allPayments() {
            let initial = [...this.mainForm.payments]

            for (let elem of this.mainForm.imported) {
                initial.push(...elem.payments)
            }

            let bothCompleted = []
            let oneIsEmpty = []
            let twoAreEmpty = []
            
            for (let index in initial) {
                let item = initial[index]
                if (item.payment_date !== '' && item.amount !== '') {
                    bothCompleted.push(item)
                } else if (item.payment_date === '' && item.amount === '') {
                    twoAreEmpty.push(item)
                } else {
                    oneIsEmpty.push(item)
                }
            }

            bothCompleted = bothCompleted.sort(
                (a, b) => new Date(a.payment_date) - new Date(b.payment_date)
            )
            
            return [...bothCompleted, ...oneIsEmpty, ...twoAreEmpty]
        }
    },
}

</script>