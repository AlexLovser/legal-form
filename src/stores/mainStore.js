import { defineStore } from 'pinia';


export const useMainStore = defineStore('mainStore', {
    state: () => {
        return {
            response: {
                'Сумма задолженности': 0,
                'Сумма пеней': 0,
                'Адресс ближайшего суда': 'Asdjhjasdknasdkjh'
            },
            serverError: null,
            showAnimation: true,
            file: null,
        };
    },
    getters: {
        responseRequested() {
            return !Object.keys(this.response).length && !this.showAnimation;
        }
    },
});