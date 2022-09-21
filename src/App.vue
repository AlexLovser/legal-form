<template>
    <div class="container center pt-5" v-cloak>
        <div class="card" style="padding: 3rem" >
            <mainInputVue 
                @submit-form="startRequest"
                @alert="onAlert"
            />
            
            <div v-if="store.showAnimation">
                <loadingAnimationVue :step="step" />
            </div>

            <resultTableVue v-if="Object.keys(store.response).length !== 0" 
                :show="show"
                @alert="onAlert"
            />
            
            <errorLabelVue v-else-if="store.serverError" :serverError="store.serverError"/>
            
            <transition name="slide-fade">
                <div v-if="show" :class="['modal', 'alert', alertType]">
                    {{alertTitle}}
                </div>
            </transition>

        </div>
    </div>

</template>

<script>
import { useMainStore } from './stores/mainStore';

import loadingAnimationVue from '@/components/loadingAnimation/loadingAnimation.vue';
import resultTableVue from '@/components/resultTable/resultTable.vue';
import mainInputVue from '@/components/mainInput/mainInput.vue';
import errorLabelVue from './components/errorLabel/errorLabel.vue';

import moment from 'moment';
const axios = require('axios').default;


export default {
    name: 'App',
    components: {
        loadingAnimationVue,
        resultTableVue,
        mainInputVue,
        errorLabelVue
    },
    data() {
        return {
            show: false,
            alertTitle: '',
            alertType: '',
            step: 0
        }
    },
    setup() {
        return {store: useMainStore()}
    },
    methods: {
        sleep(milliseconds){
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        },
        scrollToBottom() {
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        },

        onAlert(data) {
            const {message, type} = data;
            this.alertTitle = message
            this.alertType = type
            this.show = true
            
            setTimeout(() => {
                this.show = false
            }, 3500)
        },
        
        async startRequest(receivedForm) {
            this.store.showAnimation = true;

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
            };

            const parseDate = date => {
                date = new Date(moment(date).add(3, 'hours'))
                return [
                    date.getDate(), 
                    date.getMonth() + 1, 
                    date.getFullYear()
                ]
            }

            const reformatDate = date => {
                const parsed = parseDate(date)
                return parsed.join(".")
            }

            const reformatMonth = date => {
                const parsed = parseDate(date)
                parsed[0] = '01'
                if (parsed[1] < 10) {
                    parsed[1] = '0' + String(parsed[1])
                }
                return parsed.join(".")
            }
        
            receivedForm.debts = receivedForm.debts.map(debt => {
                debt.debt_start = reformatDate(debt.debt_start)
                debt.start = debt.debt_start
                debt.amount = Number(debt.amount)
                debt.part = '1/1'
                delete debt.id
                delete debt.file

                return debt
            })

            receivedForm.payments = receivedForm.payments.map(payment => {
                payment.payment_date = reformatDate(payment.payment_date)
                payment.date = payment.payment_date
                payment.amount = Number(payment.amount)
                payment.part = '1/1'
                payment.pay_for = reformatMonth(payment.pay_for)
                delete payment.id
                delete payment.file

                return payment
            })

            request.rate = Number(receivedForm.rate)
            
            if (request.rate === '4') {
                request.exact_date = reformatDate(receivedForm.exactDate)
            }

            request.stop = reformatDate(receivedForm.endDate)

            request.method = Number(receivedForm.method)
            request.debts = receivedForm.debts
            request.payments = receivedForm.payments

            await this.sleep(300)
            this.scrollToBottom()
            
            try {
                const counted = await this.countPenalties(request)
                // counted.address = await this.searchCourt(receivedForm.address) ЗАДОЛБАЛО Я НЕ ЗНАЮ ОТКУДА МНЕ ВЗЯТЬ АДРИС!!!"
                this.store.response = await this.completeRequest(counted)
            } catch (err) {
                this.serverError = 1
            } finally {
                this.scrollToBottom()
                this.showAnimation = false
                this.step = 5
            }
        },

        async countPenalties(request) {
            this.step ++
            await this.sleep(1500)
            const response = await axios.post(
                // 'http://37.46.132.129:7006/api/v1/',
                'http://94.250.248.193:7006/api/v1/',
                request,
                { headers: { 'Content-Type': 'application/json' } }
            )
            if (response.data) {
                delete response.data.result
                return response.data
            } else {
                throw new Error()
            }
        },
        
        async searchCourt(address) {
            this.step++
            await this.sleep(1500)
            if (address !== undefined && address !== '') {
                const response = await axios.post(
                    'https://search.allcourts.ru/api/v1/by_address',
                    { address, parent: true, requisites: true },
                    { headers: { 'Content-Type': 'application/json' } }
                )
                
                return response.data.data.address
            }
        },
        
        async completeRequest(response) {
            this.step ++
            await this.sleep(1500)
            const names = {
                'total_debt_amount': 'Сумма задолженности',
                'total_penalty': 'Сумма пеней',
                'address': 'Адресс ближайшего суда'
            }
            const newResponse = {}

            for (let item of Object.entries(response)) {
                newResponse[names[item[0]]] = item[1]
            }

            return newResponse
        },

    },

}
</script>

