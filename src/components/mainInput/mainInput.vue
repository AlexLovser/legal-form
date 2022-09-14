<template>
    <div class="center" @dragover="dragover" @dragleave="dragleave" @drop="drop" >
        <div class="form-control">
            <h2>Введите параметры задолженности</h2>
            <table>
                <tbody>
                    <tr>
                        <td class="column">
                            <strong>Задолженности</strong>
                            <div class="alert plain">обычно ежемесячные платежи</div>
                        </td>
                        <td>
                            <div class="row" style="align-items: center">
                                <table style="margin-bottom: 1rem">
                                    <tr>
                                        <td class="plain">Начало просрочки</td>
                                        <td class="plain">Сумма</td>
                                    </tr>
                                    <tr v-for="item in allDettes" :key="item.id">
                                        <td>
                                            <input 
                                                type="date"
                                                placeholder="дд.мм.гггг" 
                                                min="2000-01-01"
                                                max="2023-01-01"
                                                v-model="item.date"
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number"
                                                @keypress="isNumber"
                                                placeholder="сумма долга" 
                                                v-model="item.sum" 
                                            />
                                        </td>
                                        <td v-if="item.id === allDettes.at(-1).id" @click="addDette">
                                            <unicon name="plus-circle" fill="#3eaf7c" height="25" width="25"></unicon>
                                        </td>
                                        <td v-else @click="deleteDette(item.id)">
                                            <unicon name="times-circle" fill="#e53935" height="25" width="25"></unicon>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div style="row mt-1">
                                <!-- <button class="btn" @click="addOneMoreDette">Ещё долг</button> -->
                                <fileInput 
                                    title="Импорт из таблицы" 
                                    :value="mainForm.dettesFile"
                                    @input="addDettesFile"
                                />

                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="column">
                            <strong>Конечная дата</strong>
                        </td>
                        <td>
                            <table style="margin-bottom: 1rem">
                                <tr>
                                    <td>
                                        <input placeholder="дд.мм.гггг" v-model="mainForm.endDate">
                                    </td>
                                    <td>
                                        <button class="btn" @click="mainForm.endDate = '13.09.2022'">Вставить сегодня</button>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                            <strong>Процентная ставка</strong>
                        </td>
                        <td>
                            <select v-model="mainForm.rate">
                                <option value="1">Конец периода</option>
                                <option value="2">По периодам действия ставки рефинансирования</option>
                                <option value="3">День частичной оплаты</option>
                                <option value="4" selected="">День подачи иска в суд (сегодня)</option>
                                <option value="5">Указанную дату</option>
                            </select>
                            <span v-if="mainForm.rate === '5'">
                                <input type="date" placeholder="дд.мм.гггг">
                            </span>
                            
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="column">
                            <strong>Частичная оплата задолженности</strong>
                        </td>
                        <td>
                            <div class="row" style="align-items: center">
                                <table style="margin-bottom: 1rem">
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
                                            <unicon name="plus-circle" fill="#3eaf7c" height="25" width="25"></unicon>
                                        </td>
                                        <td v-else @click="deletePayment(item.id)">
                                            <unicon name="times-circle" fill="#e53935" height="25" width="25"></unicon>
                                        </td>
                                    </tr>


                                </table>
                            </div>

                            <fileInput 
                                title="Импорт из таблицы" 
                                :value="mainForm.paymentsFile"
                                @input="addPaymentsFile"
                            />

                            <!-- <label>
                                <input type="file" class="upload" name="ImportFromTable"/>
                                <button class="btn primary">
                                    Импорт из таблицы
                                </button>
                            </label> -->
                        </td>
                    </tr>

                    <tr>
                        <td><strong>Метод расчёта</strong></td>
                        <td>
                            <select v-model="mainForm.method">
                                <option value="1">1/300 на весь период к задолженностям, возникшим ранее 01.01.2016</option>
                                <option value="2">1/300 только до 01.01.2016 и редакцию от 01.01.2016 после</option>
                                <option value="3">Редакция от 01.01.2016 с первых дней задолженности</option>
                            </select>
                        </td>
                    </tr>
                    
                    <tr>
                        <td><strong>Вид отчёта</strong></td>
                        <td>
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
                    
                    <tr>
                        <td>
                            <strong>Подпись при печати</strong>
                            <div class="alert plain">Подпись сайта калькулятора покажет суду расчёт со знакомого сайта</div>
                        </td>
                        <td>
                            <div class="row">
                                <input type="checkbox" id="sign" checked="" style="width: 17px; height: 17px">&nbsp;&nbsp;Подпись сайта калькулятора расчёта при печати
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <button 
                                class="btn primary mt-1" 
                                @click="submitForm"
                                :disabled="isDisabled"
                            >
                                Рассчитать
                            </button>
                            <button class="btn danger mt-1" @click="clearForm">Очистить</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import './mainInput.css';
import fileInput from './fileInput/fileInput'


export default {
    name: 'mainInput',
    components: { 
        fileInput 
    },
    data: () => ({
        mainForm: {
            endDate: '',
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
            ]
        }
    }),
    inject: [
        'response',
        'showAnimation',
        'file'
    ],
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