import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
const axios = require('axios').default;
import {fromClipboardFormat} from '../components/mainInput/parser/parser';
import { ref } from 'vue';
import { useMainStore } from './mainStore';

export const useInputStore = defineStore('inputStore', {
    state: () => {
        const mainForm = ref({
            edited: true,
            endDate: new Date(),
            rate: '1',
            exactDate: '',
            method: '1',
            resultView: '0',
            signWhilePrint: true,
            // debts: [
            //     {
            //         id: uuidv4(),
            //         debt_start: new Date(),
            //         amount: '',
            //     }
            // ],
            // payments: [],
            sequence: [
                {
                    id: uuidv4(),
                    debt_start: new Date(),
                    amount: '',
                }
            ],
            imported: []
        });

        return {
            mainForm,
            clearResponse: () => {
                const s = useMainStore();
                s.response = {};
            }
        };
    },
    
    actions: {
        objectIsDebt(obj) {
            return obj.debt_start !== undefined;
        },

        separateToDebtsAndPayments(sequence) {
            const debts = [];
            const payments = [];

            for (let item of sequence) {
                if (this.objectIsDebt(item)) {
                    debts.push(item);
                } else {
                    payments.push(item);
                }
            }

            return { debts, payments };
        },

        clearForm() {
            this.mainForm = {
                edited: true,
                endDate: new Date(),
                rate: '1',
                exactDate: '',
                method: '1',
                resultView: '0',
                signWhilePrint: true,
                // debts: [],
                // payments: [],
                imported: [],
                sequence: [
                    {
                        id: uuidv4(),
                        debt_start: new Date(),
                        amount: '',
                    }
                ],
            };
            this.clearResponse();
        },

        dateToISO(date) {
            return date.split('.').reverse().join('-');
        },
        
        addDebt(item) {
            if (item === undefined) {
                // this.mainForm.debts.push({
                //     id: uuidv4(),
                //     debt_start: new Date(),
                //     amount: '',
                // });

                this.mainForm.sequence.push({
                    id: uuidv4(),
                    debt_start: new Date(),
                    amount: '',
                });
            } else {
                // let index = this.mainForm.debts.indexOf(item);
                // if (index === -1) {
                //     index = this.mainForm.debts.length;
                // }

                let index = this.mainForm.sequence.indexOf(item);
                if (index === -1) {
                    index = this.mainForm.sequence.length;
                }
                // this.mainForm.debts.splice(index + 1, 0, {
                //     id: uuidv4(),
                //     debt_start: new Date(),
                //     amount: '',
                // });

                this.mainForm.sequence.splice(index + 1, 0, {
                    id: uuidv4(),
                    debt_start: new Date(),
                    amount: '',
                });
            }


            this.mainForm.edited = true;
           
        },

        deleteDebt(item) {
            this.mainForm.edited = true;
            const check = el => el.id !== item.id;
            if (item.file !== undefined) {
                for (let file of this.mainForm.imported) {
                    file.debts = file.debts.filter(check);
                }
            } else {
                // this.mainForm.debts = this.mainForm.debts.filter(check);

                this.mainForm.sequence = this.mainForm.sequence.filter(check);

            }

        },

        async addFile(newFile) {
            this.mainForm.edited = true;
            let parsed = await this.extractInformation(newFile);
            parsed = parsed.data.data;

            parsed.debts = parsed.debts.map(
                value => ({
                    id: uuidv4(),
                    file: newFile.name,
                    debt_start: this.dateToISO(value.start),
                    amount: value.amount,
                })
            );

            parsed.payments = parsed.payments.map(
                value => ({
                    id: uuidv4(),
                    file: newFile.name,
                    payment_date: this.dateToISO(value.payment_date),
                    amount: value.amount,
                    part: '1/1'
                })
            );

            this.mainForm.imported.push(
                {
                    id: uuidv4(),
                    name: newFile.name,
                    ...parsed,
                }
            );

            console.log(this.mainForm.imported)
        },

        async extractInformation(file) {
            return await axios.post(
                'https://cabinet.sk-developer.ru/api/v1/dashboard/parse',
                { file },
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
        },

        deleteFile(id) {
            this.mainForm.edited = true;
            this.mainForm.imported = this.mainForm.imported.filter(
                item => item.id !== id
            );
        },

        addPayment(item) {
            if (item === undefined) {
                // this.mainForm.payments.push({
                //     id: uuidv4(),
                //     payment_date: new Date(),
                //     amount: '',
                //     pay_for: '',
                // });

                this.mainForm.sequence.push({
                    id: uuidv4(),
                    payment_date: new Date(),
                    amount: '',
                    pay_for: '',
                });
            } else {
                let index = this.mainForm.sequence.indexOf(item);
                // let index = this.mainForm.payments.indexOf(item);
                if (index === -1) {
                    // index = this.mainForm.payments.length;
                    index = this.mainForm.sequence.length;
                }

                // this.mainForm.payments.splice(index + 1, 0, {
                //     id: uuidv4(),
                //     payment_date: new Date(),
                //     amount: '',
                //     pay_for: '',
                // });

                this.mainForm.sequence.splice(index + 1, 0, {
                    id: uuidv4(),
                    payment_date: new Date(),
                    amount: '',
                    pay_for: '',
                });
            }

            this.mainForm.edited = true;
        },

        deletePayment(item) {
            this.mainForm.edited = true;
            const check = el => el.id !== item.id;
            
            if (item.file !== undefined) {
                for (let file of this.mainForm.imported) {
                    file.payments = file.payments.filter(check);
                }
            } else {
                this.mainForm.sequence = this.mainForm.sequence.filter(check);
                //this.mainForm.payments = this.mainForm.payments.filter(check);

            }
        },

        pasteFromClipboard(content) {
            const {debts_value, payments_value} = content;

            let debts = fromClipboardFormat(debts_value).debts;
            let payments = fromClipboardFormat(payments_value).debts;

            if (debts.length === 0 && payments.length === 0) {
                throw new Error();
            }
            for (let item of debts) {
                item.id = uuidv4();
            }

            for (let item of payments) {
                item.id = uuidv4();
                item.pay_for = '';
                item.payment_date = item.debt_start;
                delete item.debt_start;
            }
            this.mainForm.sequence.push(...debts);
            this.mainForm.sequence.push(...payments);
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
                this.mainForm.edited = true;
                return true;
            }

        },

    },
    getters: {
        // allDebts() {
        //     let initial = [];


        //     for (let elem of this.mainForm.imported) {
        //         initial.push(...elem.debts);
        //     }
        //     initial.push(...this.mainForm.debts);

            
        //     return initial;

        // },

        // allPayments() {
        //     let initial = [];


        //     for (let elem of this.mainForm.imported) {
        //         initial.push(...elem.payments);
        //     }
        //     initial.push(...this.mainForm.payments);

        //     return initial;
        // },

        allPaymentsAndDebts() {
            let initial = [];


            for (let elem of this.mainForm.imported) {
                initial.push(...elem.debts);
            }

            for (let elem of this.mainForm.imported) {
                initial.push(...elem.payments);
            }

            return [...initial, ...this.mainForm.sequence]; 
        }
    },
});