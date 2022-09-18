<template>
    <div class="container center pt-5" v-cloak>
        <div class="card center" >
            <mainInputVue v-if="responseRequested && !serverError" 
                @submit-form="startRequest"
                @alert="onAlert"
            />
            <errorLabelVue v-else-if="serverError" :serverError="serverError"/>
            <div v-else-if="showAnimation" class="center">
                <loadingAnimationVue :step="step" />
            </div>
            <resultTableVue v-else-if="!responseRequested" 
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
    setup() {
        const { response, step, showAnimation, show, serverError } = useMainStore();

        return { response, step, showAnimation, show, serverError }
    },
    methods: {
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
            receivedForm = receivedForm.target
            console.log(receivedForm)

            return
            /* this.showAnimation = true
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
                this.response = response.data;
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
                
                this.response.address = response.data.data.address
            }
        },
        
        completeRequest() {
            this.response = this.handleResponse(this.response);
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
        responseRequested() {
            return !Object.keys(this.response).length && !this.showAnimation
        }
    },


}
</script>

