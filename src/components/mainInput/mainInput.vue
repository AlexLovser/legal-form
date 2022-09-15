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
                    <strong>Задолженности</strong>
                    <div class="alert plain warning"><br/>Обычно ежемесячные платежи<br/><br/></div>
                    <div class="alert plain">
                        <br/>
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br/>
                        <br/>
                        <button class="btn primary row">
                            <unicon name="copy" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon> Вставить из буффера
                        </button>
                        <br/>
                        <br/>
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
                        
                            <tr v-for="item in allDettes" :key="item.id">
                                <td>
                                    <input 
                                        :ref="item.date"
                                        @keypress.enter="handleEnter"
                                        type="date"
                                        placeholder="дд.мм.гггг" 
                                        min="2000-01-01"
                                        max="2023-01-01"
                                        v-model="item.date"
                                        required
                                    />
                                </td>
                                <td>
                                    <input 
                                        :ref="item.sum"
                                        @keypress="isNumber"
                                        @keypress.enter="addDette"
                                        placeholder="сумма долга" 
                                        v-model="item.sum" 
                                        required
                                    />
                                </td>
                                <td v-if="item.id === allDettes.at(-1).id" @click="addDette">
                                    <unicon name="enter" fill="#3eaf7c"></unicon>
                                </td>
                                <td v-else @click="deleteDette(item.id)">
                                    <unicon name="trash-alt" fill="#e53935"></unicon>
                                </td>
                            </tr>

                        </table>
                    </div>
                   
                </td>
            </tr>
            
            <tr class="card mt-1">
                <td>
                    <strong>Процентная ставка</strong>
                </td>
                <td class="cell">
                    <select v-model="mainForm.rate">
                        <option value="1">Конец периода</option>
                        <option value="2">По периодам действия ставки рефинансирования</option>
                        <option value="3">День частичной оплаты</option>
                        <option value="4" selected="">День подачи иска в суд (сегодня)</option>
                        <option value="5">Указанную дату</option>
                    </select>
                    <span v-if="mainForm.rate === '5'">
                        <input type="date" placeholder="дд.мм.гггг" style="margin-top: 1rem">
                    </span>
                    
                </td>
            </tr>

            <tr class="card mt-1">
                <td>
                    <strong>Конечная дата</strong>
                    <div class="alert plain">
                        <br/>
                        Текущая дата (по умолчанию)
                        <br/>
                        <br/>
                    </div>
                </td>
                <td class="row cell">
                    <input 
                        placeholder="дд.мм.гггг" 
                        v-model="mainForm.endDate" 
                        min="2000-01-01"
                        max="2023-01-01"
                        required
                        type="date">
                        
                </td>
            </tr>
            
            <tr class="card mt-1">
                <td class="column">
                    <strong>Частичная оплата задолженности</strong>
                    <div class="alert plain">
                        <br/>
                        Скопируйте нужные столбцы в Excel и нажмите на кнопку
                        <br/>
                        <br/>
                        <button class="btn primary row">
                            <unicon name="copy" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon> Вставить из буффера
                        </button>
                        <br/>
                        <br/>
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
                                    <input 
                                        type="date"
                                        min="2000-01-01"
                                        max="2023-01-01"
                                        placeholder="дд.мм.гггг" 
                                        v-model="item.date"
                                    />
                                </td>
                                <td>
                                    <input 
                                        placeholder="сумма долга" 
                                        v-model="item.sum" 
                                        @keypress="isNumber"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="date"
                                        min="2000-01-01"
                                        max="2023-01-01"
                                        placeholder="мм.гггг" 
                                        v-model="item.month"
                                    />
                                </td>
                                <td v-if="item.id === allPayments.at(-1).id" @click="addPayment">
                                    <unicon name="enter" fill="#3eaf7c"></unicon>
                                </td>
                                <td v-else @click="deleteDette(item.id)">
                                    <unicon name="trash-alt" fill="#e53935"></unicon>
                                </td>
                            </tr>


                        </table>
                    </div>

                    <!-- <fileInput 
                        title="Импорт из таблицы" 
                        :value="mainForm.paymentsFile"
                        @input="addPaymentsFile"
                    /> -->
                </td>
            </tr>

            <tr class="card mt-1">
                <td><strong>Метод расчёта</strong></td>
                <td class="cell">
                    <select v-model="mainForm.method" >
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
                                <input value="0" type="radio" name="resultView" checked="">
                            </td>
                            <td>Обычный</td>
                            
                        </tr>
                        <tr>
                            <td style="display: flex; align-items: center">
                                <input value="1" type="radio" name="resultView">
                            </td>
                            <td>Бухгалтерский</td>
                            
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr class="card mt-1">
                <td>
                    <strong>Подпись при печати</strong>
                    <div class="alert plain">Подпись сайта калькулятора покажет суду расчёт со знакомого сайта</div>
                </td>
                <td class="cell">
                    <div class="row">
                        <input type="checkbox" id="sign" checked="" style="width: 17px; height: 17px">&nbsp;&nbsp;Подпись сайта калькулятора расчёта при печати
                    </div>
                </td>
            </tr>
        </table>
        <div class="row">
            <button 
                class="btn primary row mt-1" 
                @click="submitForm"
                :disabled="isDisabled"
            >
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
import {inject, ref} from 'vue';
// import fileInput from './fileInput/fileInput'


export default {
    name: 'mainInput',
    setup() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd

        const mainForm = ref({
            endDate: today,
            rate: '1',
            method: '1',
            dettesFile: null,
            paymentsFile: null,
            dettes: [
                {
                    id: 0,
                    date: '',
                    sum: ''
                }
            ],
            payments: [
                {
                    id: 0,
                    date: '',
                    sum: '',
                    month: ''
                }
            ],
            imported: [
                {
                    name: 'Lol.xls',
                    payments: [

                    ],
                    dettes: [

                    ]
                }
            ]
        })

        const response = inject('response')
        const showAnimation = inject('showAnimation')
        const file = inject('file')

        return {
            mainForm,
            response,
            showAnimation,
            file
        }
    },
    methods: {
        submitForm() {
            const myForm = {...this.mainForm}

            myForm.dettes = this.allDettes
            myForm.payments = this.allPayments
            this.$emit(
                'submit',
                myForm
            )
        },
        
        clearForm() {
            this.mainForm = {
                endDate: '',
                rate: '1',
                method: '1',
                dettes: [
                    {
                        id: 0,
                        date: '',
                        sum: ''
                    }
                ],
                payments: [
                    {
                        id: 0,
                        date: '',
                        sum: '',
                        month: ''
                    }
                ]
            }
        },

        addDettesFile(newFile) {
            // this.mainForm.dettesFile = newFile
            this.mainForm.dettesFile = [
                {
                    id: 2000,
                    date: '16.02.2005',
                    sum: '1234',
                }
            ]
            this.$emit('alert', `Данные были успешно импортированы из файла "${newFile.name}"`)
        },
        
        addPaymentsFile(newFile) {
            this.mainForm.paymentsFile = newFile
            this.$emit('alert', `Данные были успешно импортированы из файла "${newFile.name}"`)
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

        addDette() {
            let previous = this.mainForm.dettes.at(-1).id
            this.mainForm.dettes.push(
                {
                    id: previous + 1,
                    date: '',
                    sum: ''
                }
            )
        },

        deleteDette(id) {
            this.mainForm.dettes = this.mainForm.dettes.filter(
                item => item.id !== id
            )
        },

        addOneMoreDette() {
            let newItem = {...this.mainForm.dettes.at(-1)}
            newItem.id ++
            this.mainForm.dettes.push(newItem)
        },
        
        addPayment() {
            let previous = this.mainForm.payments.at(-1).id
            this.mainForm.payments.push(
                {
                    id: previous + 1,
                    date: '',
                    sum: '',
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
            return false
        },

        allDettes() {
            let initial
            if (this.mainForm.dettesFile) {
                initial = [...this.mainForm.dettes, ...this.mainForm.dettesFile]
            } else {
                initial = this.mainForm.dettes
            }
            return initial
        },

        allPayments() {
            let initial
            if (this.mainForm.paymentsFile) {
                initial = [...this.mainForm.payments, ...this.mainForm.paymentsFile]
            } else {
                initial = this.mainForm.payments
            }
            return initial
        }
    },
}

</script>