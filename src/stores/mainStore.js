import { defineStore } from 'pinia';


export const useMainStore = defineStore('mainStore', {
    state: () => {
        return {
            response: {},
            showAnimation: false,
            file: null,
        };
    },
    getters: {
        responseRequested() {
            return !Object.keys(this.response).length && !this.showAnimation;
        }
    },
});