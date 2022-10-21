<template>
    <div class="container" v-cloak>
        <div class="card" style="padding: 3rem" >
            <mainInputVue 
                @submit-form="startRequest"
                @alert="onAlert"
            />
            
            <loadingAnimationVue :step="step" v-if="store.showAnimation"/>

            <resultTableVue v-if="Object.keys(store.response).length !== 0" 
                :show="show"
                @alert="onAlert"
            />
                        
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
import { v4 as uuidv4 } from 'uuid';
import loadingAnimationVue from '@/components/loadingAnimation/loadingAnimation.vue';
import resultTableVue from '@/components/resultTable/resultTable.vue';
import mainInputVue from '@/components/mainInput/mainInput.vue';
import { DateTime } from 'luxon';

const axios = require('axios').default;


export default {
    name: 'App',
    components: {
        loadingAnimationVue,
        resultTableVue,
        mainInputVue,
    },
    setup() {
        return {
            store: useMainStore(),
            show: false,
            alertTitle: '',
            alertType: '',
            step: 0
        }
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
            console.log(receivedForm)
            this.store.showAnimation = true;
            this.store.response = {}

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

            const reformatDate = date => {
                date = DateTime.fromISO(date)
                date = date.plus({hour: 3})
                return date.toFormat('dd.MM.yyyy')
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
                if (payment.pay_for !== '') {
                    let {month, year} = payment.pay_for
                    month ++
                    if (month < 10) {
                        month = '0' + String(month)
                    } else {
                        month = String(month)
                    }

                    payment.pay_for = '01.' + month + '.' + year
                } else {
                    delete payment.pay_for
                }
                
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
            console.log('Request', request)

            await this.sleep(300)
            this.scrollToBottom()
            
            try {
                const counted = await this.countPenalties(request)
                console.log(counted)
                // counted.address = await this.searchCourt(receivedForm.address) ЗАДОЛБАЛО Я НЕ ЗНАЮ ОТКУДА МНЕ ВЗЯТЬ АДРИС!!!"
                // this.store.response = await this.completeRequest(counted)
                this.store.response = counted
            } finally {
                this.scrollToBottom()
                this.store.showAnimation = false
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
                for (let item of response.data.result) {
                    item.id = uuidv4()
                }   
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
    },

}
</script>

