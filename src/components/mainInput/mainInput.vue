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
                                        <td>Начало просрочки</td>
                                        <td>Сумма</td>
                                    </tr>
                                    <tr v-for="item in mainForm.dettes" :key="item.id">
                                        <td>
                                            <input 
                                                type="date"
                                                placeholder="дд.мм.гггг" 
                                                min="2000-01-01"
                                                v-model="item.date"
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number"
                                                placeholder="сумма долга" 
                                                v-model="item.sum" 
                                            />
                                        </td>
                                        <td v-if="item.id === mainForm.dettes[mainForm.dettes.length - 1].id" @click="addNewDette">
                                            <unicon name="plus-circle" fill="#3eaf7c" height="25" width="25"></unicon>
                                        </td>
                                        <td v-else @click="deleteDette(item.id)">
                                            <unicon name="times-circle" fill="#e53935" height="25" width="25"></unicon>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div style="row mt-1">
                                <button class="btn" onclick="">Ещё долг</button>
                                <button class="btn" onclick="">Импорт из таблицы</button>
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
                            <select id="rateType" onchange="">
                                <option value="2">по периодам действия ставки рефинансирования</option>
                                <option value="1">на конец периода</option>
                                <option value="3">на день частичной оплаты</option>
                                <option value="4" selected="">на день подачи иска в суд (сегодня)</option>
                                <option value="5">на указанную дату</option>
                            </select>
                            <input style="display: none; width:80px" id="rateDate" type="text" placeholder="дд.мм.гггг" autocomplete="off" class="hasDatepicker">
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
                                        <td>Дата оплаты</td>
                                        <td>Сумма</td>
                                        <td>Месяц (если указан)</td>
                                    </tr>

                                    <tr v-for="item in mainForm.payments" :key="item.id">
                                        <td>
                                            <input placeholder="дд.мм.гггг" v-model="item.date"/>
                                        </td>
                                        <td>
                                            <input placeholder="сумма долга" v-model="item.sum"/>
                                        </td>
                                        <td>
                                            <input placeholder="мм.гггг" v-model="item.month"/>
                                        </td>
                                        <td v-if="item.id === mainForm.payments[mainForm.payments.length - 1].id" @click="addNewPayment">
                                            <unicon name="plus-circle" fill="#3eaf7c" height="25" width="25"></unicon>
                                        </td>
                                        <td v-else @click="deletePayment(item.id)">
                                            <unicon name="times-circle" fill="#e53935" height="25" width="25"></unicon>
                                        </td>
                                    </tr>


                                </table>
                            </div>

                            <button class="btn" onclick="">Импорт из таблицы</button>
                        </td>
                    </tr>

                    <tr>
                        <td><strong>Метод расчёта</strong></td>
                        <td>
                            <select id="method" onchange="">
                                <option value="1">Применять 1/300 на весь период к задолженностям, возникшим ранее 01.01.2016</option>
                                <option value="2">Применять 1/300 только до 01.01.2016 и редакцию от 01.01.2016 после</option>
                                <option value="3">Применять редакцию от 01.01.2016 с первых дней задолженности</option>
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
                            <button class="btn primary mt-1" @click="() => console.log(mainForm)" >Рассчитать</button>
                            <button class="btn danger mt-1" @click="$emit('submit')" >Очистить</button>
                        </td>
                    </tr>
                    {{mainForm.dettes}}
                </tbody>
            </table>
        </div>

                
        <!-- <input 
        type="file" 
        id="assetsFieldHandle" 
        class="upload-photo center"
        @change="onChange"
        ref="myFileInput" 
        accept=".xls"
        > -->
        <!-- <label for="assetsFieldHandle" class="input-label">
        Перетащите сюда ваши файлы <strong :class="err ? 'danger' : 'none'">.xls</strong> или <span class="underline primary">кликните тут</span> чтобы загрузить их
        </label> -->

        <!-- <div class="card mt-1 list-item file alert" v-if="file !== null" >
          {{ file.name }} <button  class="btn danger" type="button" @click="remove">Удалить</button>
        </div>
         -->
    </div>
</template>

<script>
import './mainInput.css';

export default {
    name: 'mainInput',
    data: () => ({
        err: false,
        mainForm: {
            endDate: '',
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
        deleteDette(id) {
            this.mainForm.dettes = this.mainForm.dettes.filter(
                item => item.id !== id
            )
        },

        addNewDette() {
            let previous = this.mainForm.dettes[this.mainForm.dettes.length - 1].id
            this.mainForm.dettes.push(
                {
                    id: previous + 1,
                    date: '',
                    sum: ''
                }
            )
        },
        
        deletePayment(id) {
            this.mainForm.payments = this.mainForm.payments.filter(
                item => item.id !== id
            )
        },

        addNewPayment() {
            let previous = this.mainForm.payments[this.mainForm.payments.length - 1].id
            this.mainForm.payments.push(
                {
                    id: previous + 1,
                    date: '',
                    sum: '',
                    month: ''
                }
            )
        },
        
        onChange() {
            let newFile = this.$refs.myFileInput.files[0];
            if (!newFile) {
                return
            }

            if (newFile.name.endsWith('.xls')) {
                this.err = false
                // this.$emit('fileChange', newFile)
            } else {
                this.err = true
            }
        },
        
        remove() {
            this.$refs.myFileInput.value = null
            // this.$emit('fileChange', null)
        },
        
        dragover(event) {
            event.currentTarget.style.opacity = 0.5
        },
        
        dragleave(event) {
            event.currentTarget.style.opacity = 1
        },
        
        drop(event) {
            event.preventDefault();
            this.$refs.myFileInput.files = event.dataTransfer.files;
            this.dragleave(event)
            this.onChange()
        },
    },
    computed: {
        isDisabled() {
            return this.file == null || this.showAnimation || !this.response
        },
    },
}

</script>