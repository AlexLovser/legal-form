<template>
    <div class="container center pt-5" v-cloak>
        <div class="card center" >
            <mainInputVue 
                @submit-form="startRequest"
                @alert="onAlert"
            />
            
            <div v-if="store.showAnimation" class="center">
                <loadingAnimationVue :step="step" />
            </div>

            
            <errorLabelVue v-else-if="store.serverError" :serverError="store.serverError"/>
            <resultTableVue v-else-if="!store.responseRequested" 
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

import loadingAnimationVue from '@/components/loadingAnimation/loadingAnimation.vue';
import resultTableVue from '@/components/resultTable/resultTable.vue';
import mainInputVue from '@/components/mainInput/mainInput.vue';
import errorLabelVue from './components/errorLabel/errorLabel.vue';

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
        
        startRequest(receivedForm) {
            this.store.showAnimation = true;
            setTimeout(this.scrollToBottom, 500)

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

            function padTo2Digits(num) {
                return num.toString().padStart(2, '0');
            }

            const reformatDate = date => {
                return [
                    padTo2Digits(date.getDate()),
                    padTo2Digits(date.getMonth() + 1),
                    date.getFullYear(),
                ].join('.')
            }

            receivedForm.debts = receivedForm.debts.map(debt => {
                debt.debt_start = reformatDate(debt.debt_start)
                debt.amount = Number(debt.amount)
                delete debt.id
                return debt
            })
            receivedForm.payments = receivedForm.payments.map(payment => {
                payment.payment_date = reformatDate(payment.payment_date)
                payment.amount = Number(payment.amount)
                delete payment.id
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
            

            console.log(request)


            /* 
            this.countPenalties
            .then(this.searchCourt)
            .then(this.completeRequest)
            .catch(
                err => {
                    this.serverError = Number(err.message)
                }
            )
            .finally(
                () => {
                    this.showAnimation = false
                    this.step = 5
                }
            ) */
        },

        async countPenalties() {
            const response = await axios.post(
                // 'http://37.46.132.129:7006/api/v1/',
                'http://94.250.248.193:7006/api/v1/',
                this.extractedData,
                { headers: { 'Content-Type': 'application/json' } }
            ).catch(
                () => {
                    throw new Error('2')
                }
            )
            if (response.data) {
                delete response.data.result
                this.store.response = response.data;
            } else {
                throw new Error('2')
            }
        },
        
        async searchCourt() {
            this.step++
            const address = this.address
            if (address && address !== '') {
                const response = await axios.post(
                    'https://search.allcourts.ru/api/v1/by_address',
                    { address, parent: true, requisites: true },
                    { headers: { 'Content-Type': 'application/json' } }
                )
                .catch(
                    () => {
                        throw new Error('3')
                    }
                )
                
                this.store.response.address = response.data.data.address
            }
        },
        
        completeRequest() {
            this.store.response = this.handleResponse(this.response);
        },

        handleResponse(response) {
            this.step++
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
        }
    },

    computed: {
        
    },


}
</script>

