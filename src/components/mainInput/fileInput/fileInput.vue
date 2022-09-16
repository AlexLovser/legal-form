<template>
    <div class="row">
        <input 
            type="file" 
            @input="handleFileChange" 
            style="display: none" 
            :id="custom_id"
            accept=".xls"
        />
        <button class="btn primary row" @click="handlePress" :disabled="disabled">
            <unicon name="plus" fill="#fff" height="25" width="25" style="margin-right: 1rem"></unicon> Добавить файл
        </button>
    </div>
</template>


<script>
import "../mainInput.css";


export default {
    name: 'fileInput',
    props: ['disabled'],
    setup() {
        const custom_id = (Math.floor(Math.random() * 1000)).toString()
        return {
            custom_id
        }
    },

    methods: {
        handlePress() {
            document.getElementById(this.custom_id).click()
        },

        handleFileChange(e) {
            if (e.target.files) {
                const file = e.target.files[0]
                if (file.name.endsWith('.xls')) {
                    this.$emit('file-input', file)
                } else {
                    this.$parent.$emit('alert', {message: 'Допускаются только файлы с расширением ".xls"', type: 'danger'})
                }
                
            }
            
        }
    }
}
</script>
