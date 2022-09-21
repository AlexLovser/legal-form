import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
const axios = require('axios').default;
import moment from 'moment';


export const useInputStore = defineStore('inputStore', {
    state: () => {
        var timedifference = new Date().getTimezoneOffset();
        
        const mainForm = {
            endDate: new Date(),
            rate: '1',
            exactDate: '',
            method: '1',
            resultView: '0',
            signWhilePrint: true,
            debts: [
                {
                    id: uuidv4(),
                    debt_start: new Date(moment() + timedifference),
                    amount: ''
                }
            ],
            payments: [
                {
                    id: uuidv4(),
                    payment_date: new Date(moment() + timedifference),
                    amount: '',
                    pay_for: ''
                }
            ],
            imported: [
            ]
        };

        return {
            mainForm,
            timedifference
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
                    debt_start: new Date(moment().add(3, 'hours')),
                    amount: ''
                }
            );
        },

        deleteDebt(id) {
            this.mainForm.debts = this.mainForm.debts.filter(
                item => item.id !== id
            );
        },

        async addFile(newFile) {
            let parsed = await this.extractInformation(newFile);
            parsed = parsed.data.data;
            const remakeDate = date => date.split('.').reverse().join('-');

            parsed.debts = parsed.debts.map(
                value => {
                    value.id = uuidv4();
                    value.file = newFile.name;
                    value.debt_start = new Date(moment(remakeDate(value.start)).add(3, 'hours'));
                    return value;
                }
            );

            parsed.payments = parsed.payments.map(
                value => {
                    value.id = uuidv4();
                    value.file = newFile.name;
                    value.payment_date = new Date(moment(remakeDate(value.payment_date)).add(3, 'hours'));
                    value.part = '1/1';
                    return value;
                }
            );

            this.mainForm.imported.push(
                {
                    id: uuidv4(),
                    name: newFile.name,
                    ...parsed,
                }
            );
        },

        async extractInformation(file) {
            return await axios.post(
                'https://cabinet.sk-developer.ru/api/v1/dashboard/parse',
                { file },
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
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
                    payment_date: new Date(moment().add(3, 'hours')),
                    amount: '',
                    pay_for: ''
                }
            );
        },

        deletePayment(id) {
            this.mainForm.payments = this.mainForm.payments.filter(
                item => item.id !== id
            );
        },
        isNumber(event, amount) {
            let value = event.key;
            if (isNaN(value) && value !== '.' && value !== '-') {
                event.preventDefault();
            } else if (value === '.') {
                if (String(amount).indexOf('.') > -1) {
                    event.preventDefault();
                } else if (amount.length == 0) {
                    event.preventDefault();
                } else if (amount.length == 1 && amount[0] === '-') {
                    event.preventDefault();
                }
            } else if (value === '-' && amount.length !== 0) {
                event.preventDefault();
            } else {
                return true;
            }

        },

    },
    getters: {
        allDebts() {
            let initial = [];


            for (let elem of this.mainForm.imported) {
                initial.push(...elem.debts);
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
                initial.push(...elem.payments);
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