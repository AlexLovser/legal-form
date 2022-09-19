import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
const axios = require('axios').default;


export const useInputStore = defineStore('inputStore', {
    state: () => {
        const mainForm = {
            endDate: new Date(),
            rate: '1',
            providedDate: '',
            method: '1',
            resultView: '0',
            signWhilePrint: true,
            debts: [
                {
                    id: uuidv4(),
                    debt_start: new Date(),
                    amount: ''
                }
            ],
            payments: [
                {
                    id: uuidv4(),
                    payment_date: new Date(),
                    amount: '',
                    month: ''
                }
            ],
            imported: [
            ]
        };

        return {
            mainForm,
        };
    },
    actions: {
        clearForm() {
            this.mainForm = {
                endDate: new Date(),
                rate: '1',
                providedDate: '',
                method: '1',
                resultView: '0',
                signWhilePrint: true,
                debts: [
                    {
                        id: uuidv4(),
                        debt_start: new Date(),
                        amount: ''
                    }
                ],
                payments: [
                    {
                        id: uuidv4(),
                        payment_date: new Date(),
                        amount: '',
                        month: ''
                    }
                ],
                imported: [
                ]
            };
        },
        
        addDebt() {
            this.mainForm.debts.push(
                {
                    id: uuidv4(),
                    debt_start: new Date(),
                    amount: ''
                }
            );
        },

        deleteDebt(id) {
            this.mainForm.debts = this.mainForm.debts.filter(
                item => item.id !== id
            );
        },

        addFile(newFile) {
            this.extractInformation(newFile).then(
                parsed => {
                    parsed = this.handleData(parsed.data.data)

                    for (let item of parsed.debts) {
                        item.id = uuidv4();
                    }

                    for (let item of parsed.payments) {
                        item.id = uuidv4();
                    }

                    this.mainForm.imported.push(
                        {
                            id: uuidv4(),
                            name: newFile.name,
                            ...parsed,
                        }
                    )

                    this.$emit(
                        'alert',
                        {
                            message: `Данные из файла ${newFile.name} успешно импортированы!`,
                            type: 'primary'
                        }
                    );
                }
            ).catch(
                () => {
                    this.$emit('alert', { message: 'Невалидный файл, попробуйте скачать образец ниже', type: 'danger' });
                }
            );


        },

        async extractInformation(file) {
            const response = await axios.post(
                'https://cabinet.sk-developer.ru/api/v1/dashboard/parse',
                { file },
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response;

        },

        handleData(data) {
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

            let { debts, payments, address } = data;

            this.address = address;

            debts = debts.map(
                value => {
                    value.debt_start = new Date(value.start);
                    return value;
                }
            );

            payments = payments.map(
                value => {
                    value.payment_date = new Date(value.payment_date);
                    value.part = '1/1';
                    return value;
                }
            );

            request.debts = debts;
            request.payments = payments;

            return request;

        },

        deleteFile(id) {
            this.mainForm.imported = this.mainForm.imported.filter(
                item => item.id !== id
            );
        },

        addPayment() {
            this.mainForm.payments.push(
                {
                    id: uuidv4(),
                    payment_date: '',
                    amount: '',
                    month: ''
                }
            );
        },

        deletePayment(id) {
            this.mainForm.payments = this.mainForm.payments.filter(
                item => item.id !== id
            );
        },
    },
    getters: {
        allDebts() {
            let initial = [];

            for (let elem of this.mainForm.imported) {
                initial.push(...elem.debts.map(
                    item => {
                        item.file = elem.name;
                        return item;
                    }
                ));
            }
            initial.push(...this.mainForm.debts);

           /*  let bothCompleted = []
            let oneIsEmpty = []
            let twoAreEmpty = []
            
            for (let index in initial) {
                let item = initial[index]
                if (item.debt_start !== '' && item.amount !== '') {
                    bothCompleted.push(item)
                } else if (item.debt_start === '' && item.amount === '') {
                    twoAreEmpty.push(item)
                } else {
                    oneIsEmpty.push(item)
                }
            }

            bothCompleted = bothCompleted.sort(
                (a, b) => new Date(a.debt_start) - new Date(b.debt_start)
            ) */
            
            // return [...bothCompleted, ...oneIsEmpty, ...twoAreEmpty]
            
            return initial;

        },

        allPayments() {
            let initial = [...this.mainForm.payments];

            for (let elem of this.mainForm.imported) {
                initial.push(...elem.payments.map(
                    item => {
                        item.file = elem.name;
                        return item;
                    }
                ));
            }

            /* let bothCompleted = [];
            let oneIsEmpty = [];
            let twoAreEmpty = [];
            
            for (let index in initial) {
                let item = initial[index];
                if (item.payment_date !== '' && item.amount !== '') {
                    bothCompleted.push(item);
                } else if (item.payment_date === '' && item.amount === '') {
                    twoAreEmpty.push(item);
                } else {
                    oneIsEmpty.push(item);
                }
            }

            bothCompleted = bothCompleted.sort(
                (a, b) => new Date(a.payment_date) - new Date(b.payment_date)
            ); 
            
            return [...bothCompleted, ...oneIsEmpty, ...twoAreEmpty];*/
            return initial;
        }
    },
});