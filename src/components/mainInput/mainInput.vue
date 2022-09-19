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
                    <strong>Файлы [ {{store.mainForm.imported.length}} / 10 ]</strong>
                    <div class="alert plain">
                        <br />
                        Данные из файлов автоматически добавляются в форму. Удаляя файл вы удаляете его данные из формы
                        <br />
                        <br />
                        <fileInput @fileInput="store.addFile" :disabled="store.mainForm.imported.length === 10" />
                        <br />
                        <br />
                        <span class="row">
                            <unicon name="file-check" fill="#42b983" height="30" width="30" style="margin-right: 1rem"></unicon> 
                            <span>Значок обозначает, что данная запись была добавлена из файла</span>
                        </span> 
                        <br>
                    </div>
                </td>
                <td class="cell">
                    <ul class="row" style="list-style-type: none" v-if="store.mainForm.imported.length !== 0">
                        <li v-for="file in store.mainForm.imported" :key="file.id" class="row">
                            <button class="file-item" style="min-width: 350px">
                                {{file.name}}
                                <unicon name="file-check" fill="#fff" height="30" width="30" style="margin-right: 1rem"></unicon> 
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
                        <option value="1">Конец периода</option>
                        <option value="2">По периодам действия ставки рефинансирования</option>
                        <option value="3">День частичной оплаты</option>
                        <option value="4">День подачи иска в суд (сегодня)</option>
                        <option value="5">Указанную дату</option>
                    </select>
                    <span v-if="store.mainForm.rate === '5'">
                        <dateInputVue 
                            style="margin-top: 1rem"
                            format="dd.MM.yyyy"
                            @date-input="newValue => store.mainForm.providedDate = newValue" 
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
                    <div class="row">
                        <input type="checkbox" id="sign" v-model="store.mainForm.signWhilePrint" required
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
            <button class="btn danger mt-1" @click="store.clearForm">
                <unicon name="redo" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon>
                Очистить
            </button>
        </div>
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
        submitForm() {
            const myForm = { ...this.store.mainForm }

            myForm.debts = this.store.allDebts
            myForm.payments = this.store.allPayments
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