import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
const axios = require('axios').default;
import {fromClipboardFormat} from '../components/mainInput/parser/parser';


export const useInputStore = defineStore('inputStore', {
    state: () => {
        var timedifference = new Date().getTimezoneOffset();
        
        const mainForm = {
            edited: true,
            endDate: new Date(),
            rate: '1',
            exactDate: '',
            method: '1',
            resultView: '0',
            signWhilePrint: true,
            debts: [
                {
                    id: uuidv4(),
                    debt_start: new Date(),
                    amount: '',
            }
            ],
            payments: [],
            imported: []
        };

        return {
            mainForm,
            timedifference
        };
    },
    
    actions: {
        clearForm() {
            this.mainForm = {
                edited: true,
                endDate: new Date(),
                rate: '1',
                providedDate: '',
                method: '1',
                resultView: '0',
                signWhilePrint: true,
                debts: [],
                payments: [],
                imported: []
            };
        },

        dateToISO(date) {
            return date.split('.').reverse().join('-');
        },
        
        addDebt(item) {
            if (item === undefined) {
                this.mainForm.debts.push({
                    id: uuidv4(),
                    debt_start: new Date(),
                    amount: '',
                });
            } else {
                let index = this.mainForm.debts.indexOf(item);
                if (index === -1) {
                    index = this.mainForm.debts.length;
                }
                this.mainForm.debts.splice(index + 1, 0, {
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
                this.mainForm.debts = this.mainForm.debts.filter(check);

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
                this.mainForm.payments.push({
                    id: uuidv4(),
                    payment_date: new Date(),
                    amount: '',
                    pay_for: '',
                });
            } else {
                let index = this.mainForm.payments.indexOf(item);
                if (index === -1) {
                    index = this.mainForm.payments.length;
                }

                this.mainForm.payments.splice(index + 1, 0, {
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
                this.mainForm.payments = this.mainForm.payments.filter(check);

            }
        },

        pasteDebtFromClipboard(content) {
            let parsed = fromClipboardFormat(content);
            parsed = parsed.debts;
            if (parsed.length == 0) {
                throw new Error();
            }
            for (let item of parsed) {
                item.id = uuidv4();
            }
            this.mainForm.debts.push(...parsed);
        },

        pastePaymentFromClipboard(content) {
            let parsed = fromClipboardFormat(content);
            parsed = parsed.debts;
            if (parsed.length == 0) {
                throw new Error();
            }
            for (let item of parsed) {
                item.id = uuidv4();
                item.pay_for = '';
                item.payment_date = item.debt_start;
                delete item.debt_start;

            }
            this.mainForm.payments.push(...parsed);
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
            let initial = [];


            for (let elem of this.mainForm.imported) {
                initial.push(...elem.payments);
            }
            initial.push(...this.mainForm.payments);

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