<template>
	<div class="container center pt-5" v-cloak>
		<div class="card field center">
			<fileInputVue v-if="responseRequested && !serverError" :startRequest="startRequest"
				:showAnimation="showAnimation" :response="response" />
			<div v-else-if="serverError">
				<ul class="list">
					<li class="list-item center" v-for="(i, index) of serverError" :key="index">
						{{ i.message }}
					</li>
				</ul>
			</div>
			<div v-else-if="showAnimation" class="center">
				<loadingAnimationVue :step='step' />
			</div>
			<resultTableVue v-else-if="!responseRequested" :response="response" />
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

const request = async (url, params = {}, providedOptions = {}, method = 'GET') => {
	const options = {
		method,
		contentType: 'application/json',
		body: JSON.stringify(params),
		...providedOptions
	};

	if ('GET' === method) {
		url += '?' + (new URLSearchParams(params)).toString();
	} else {
		options.body = JSON.stringify(params);
	}

	const response = await fetch(url, options);
	return await response.json();
};
// const get = ( url, params, options={} ) => request( url, params, options, 'GET' );
const post = (url, params, options = {}) => request(url, params, options, 'POST');

export default {
	name: 'App',
	components: {
		loadingAnimationVue,
		resultTableVue,
		fileInputVue
	},
	data: () => ({
		file: null,
		err: false,
		step: 0,
		showAnimation: false,
		show: false,
		response: {},
		serverError: null
	}),
	emits: {
		onFileInput: ({ newFile }) => this.file = newFile
	},
	methods: {
		startRequest(event) {
			event.preventDefault()
			this.showAnimation = true

			new Promise(
				resolve => { // Распаковка
					const params = this.extractInformation(this.file)
					console.log(params)
					this.step++
					resolve(params)
				}

			)	.then(params => new Promise(
					(resolve, reject) => { // Отправка
						this.step++
						post('http://37.46.132.129:7006/api/v1/', params)
							.then(response => {
								console.log(response)
								if (response.status === 'error') {
									reject(response)
								} else {
									resolve({
										total_debt_amount: response.total_debt_amount,
										total_penalty: response.total_penalty
									})
								}
							});

					}
			))	.then(response => new Promise(
					resolve => setTimeout(
						() => {
							this.step++
							console.log('1')
							resolve(response)
						}, 2500)
			))	.then(response => new Promise(
					resolve => setTimeout(
						() => {
							this.step++
							console.log('2')
							resolve(response)
						}, 500)
			))	.then(response => new Promise(
					resolve => setTimeout(
						() => {
							this.step++
							console.log('3')
							resolve(response)
						}, 1000)
			))	.then(response => {
					this.showAnimation = false
					this.response = response
			})
				.catch(reason => {
					this.step = 5
					this.showAnimation = false
					this.serverError = reason.messages
				})
		},
		extractInformation: async (file) => await post(
			'https://cabinet.sk-developer.ru/api/v1/dashboard/parse',
			{ file },
			{ contentType: 'multipart/form-data' }
		)
	},

	computed: {

		responseRequested() {
			return !Object.keys(this.response).length && !this.showAnimation
		}

	},
	watch: {
		showAnimation() {
			return this.file !== null & this.response === null
		},


	},

}
</script>

