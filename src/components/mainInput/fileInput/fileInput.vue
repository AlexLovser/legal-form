<template>
    
    <div class="input-left">
        <strong>Файлы [ {{store.mainForm.imported.length}} / 10 ]</strong>
        
        <div class="alert plain">
            <br />
            Данные из файлов автоматически добавляются в форму. Удаляя файл вы удаляете его данные из формы
            <br />
            <br />

            <div class="row">
                <input 
                    type="file" 
                    @input="handleFileChange" 
                    style="display: none" 
                    ref="fileInput"
                    accept=".xls"
                />
                <button class="btn primary row" 
                    @click="handlePress" 
                    :disabled="store.mainForm.imported.length === 10">
                    <unicon 
                        name="plus" 
                        fill="#fff" 
                        height="25" 
                        width="25" 
                        style="margin-right: 1rem">
                    </unicon> Добавить файл
                </button>
            </div>
            
            <br />
            <br />

            <span class="row">
                <unicon 
                    name="file-check" 
                    fill="#42b983" 
                    height="30" 
                    width="30" 
                    style="margin-right: 1rem">
                </unicon> 
                <span>Значок обозначает, что данная запись была добавлена из файла</span>
            </span> 
            <br>
        </div>
    </div>

    <div class="input-right" style="justify-content: flex-top">
        <ul 
            class="row" 
            style="list-style-type: none" 
            v-if="!noFilesLoaded"
        >
            <li v-for="file in store.mainForm.imported" :key="file.id" class="row">
                <button class="file-item" style="min-width: 350px">
                    {{file.name}}
                    <unicon 
                        name="file-check" 
                        fill="#fff" 
                        height="30" 
                        width="30" 
                        style="margin-right: 1rem">
                    </unicon> 

                </button>

                <button 
                    class="file-item" 
                    style="background: #e53935; border-color: #e53935;"
                    @click="store.deleteFile(file.id)"
                >
                    <unicon name="times" fill="#fff"></unicon>

                </button>
            </li>
        </ul>

        <span v-else class="plain file-container"  style="justify-content: center">
            <unicon name="file-slash" fill="#8c8989" height="50" width="50" style="margin-bottom: 1rem">
            </unicon>
            Вы еще не добавили ни одного файла...
        </span>
    </div>
   
</template>


<script>
import { useInputStore } from "@/stores/inputStore";
import "../mainInput.css";
import './fileInput.css';


export default {
    name: 'fileInput',
    setup() {
        const store = useInputStore()
        return {
            store
        }
    },

    methods: {
        handlePress() {
            this.$refs.fileInput.click()
        },

        handleFileChange(e) {
            if (e.target.files) {
                const file = e.target.files[0]
                if (file.name.endsWith('.xls')) {
                    this.store.addFile(file)
                } else {
                    this.$parent.$emit('alert', {message: 'Допускаются только файлы с расширением ".xls"', type: 'danger'})
                }
                
            }
            
        }
    }, computed: {
        noFilesLoaded() {
            return this.store.mainForm.imported.length === 0
        }
    }
}
</script>
