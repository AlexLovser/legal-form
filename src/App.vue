<template>
	<div class="container center pt-5" v-cloak>
		<div class="card field center">
			<fileInputVue v-if="responseRequested && !serverError" 
				:startRequest="startRequest"
				:setNewFile="setFile"
			/>
			<errorLabelVue v-else-if="serverError"/>
			<div v-else-if="showAnimation" class="center">
				<loadingAnimationVue :step='step' />
			</div>
			<resultTableVue v-else-if="!responseRequested" />
			<transition name="slide-fade">
				<div v-if="show" class="modal alert primary">
					Скопировано
				</div>
			</transition>

		</div>
	</div>

</template>

<script>

import loadingAnimationVue from '@/components/loadingAnimation.vue';
import resultTableVue from '@/components/resultTable.vue';
import fileInputVue from '@/components/fileInput.vue';
import errorLabelVue from './components/errorLabel.vue';

import {ref, provide} from 'vue';
const axios = require('axios').default;


const useState = arg => {
	const value = ref(arg)

	const setValue = newValue => {
		value.value = newValue
	}

	return [value, setValue]
}

export default {
	name: 'App',
	components: {
		loadingAnimationVue,
		resultTableVue,
		fileInputVue,
		errorLabelVue
	},
	setup() {
		const response = ref({})
		const serverError = ref(null)
		const showAnimation = ref(false)
		const [file, setFile] = useState(null)


		provide('response', response)
		provide('showAnimation', showAnimation)
		provide('serverError', serverError)

		return {
			response,
			showAnimation,
			file,
			setFile,
			serverError,
			err: false,
			step: 0,
			show: false,
			extractedData: null,
		}
	},
	methods: {
		startRequest(event) {
			event.preventDefault()
			this.showAnimation = true
			this.extractInformation()
			.then(this.countPenalties)
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
			)
		},

		async extractInformation() {
			this.step++
			const response = await axios.post(
				'https://cabinet.sk-developer.ru/api/v1/dashboard/parse',
				{ file: this.file },
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			).catch(
				() => {
					throw new Error('1')
				}
			)

			this.extractedData = this.handleData(response.data.data);
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
				"custom_rate": 0
			}

			// let dates = data['period'].split(' ')
			let {debts, payments} = data;

			debts = debts.map(
				value => {
					value.debt_start = value.start
					return value
				}
			)

			payments = payments.map(
				value => {
					value.date = value.payment_date
					value.part = '1/1'
					return value
				}
			)

			request.debts = debts
			request.payments = payments
			return request

		},

		async countPenalties() {
			this.step++
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
				this.response = this.handleResponse(response.data);
			} else {
				throw new Error('2')
			}
		},
		
		handleResponse(response) {
			this.step++
			const names = {
				'total_debt_amount': 'Сумма задолженности',
				'total_penalty': 'Сумма пеней'
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

