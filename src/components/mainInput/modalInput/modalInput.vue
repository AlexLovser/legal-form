<template>
    <div class="modal-mask" v-if="show">
        <transition name="slide-fade">
            <div class="modal column">
                <span class="plain mt-1">
                    Вставка "Дата" и "Число". 
                </span>
                <textarea class="modal-input mt-1" v-model="value"></textarea>
                <button class="btn primary mt-1" @click="handleSubmit">
                    Сохранить
                </button>
            </div>
        </transition>
    </div>

</template>


<script>
import './modalInput.css';
import { ref } from 'vue';
import { useMainStore } from '@/stores/mainStore';


export default {
    name: 'modelInput',
    props: ['for', 'show'],
    setup() {
        const value = ref('')
        const store = useMainStore()
       
        return {
            value,
            store
        }
    },
    methods: {
        handleSubmit() {
            this.$emit('saved', this.value)
            this.value = ''
        }
    }
}

</script>