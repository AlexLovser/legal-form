import { defineStore } from 'pinia';


export const useMainStore = defineStore('mainStore', {
    state: () => {
        return {
            response: {},
            serverError: null,
            showAnimation: false,
            file: null,
            show:false,
        };
    },
    actions: {
        
    },
});