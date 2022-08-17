<template>
    <div class="center" @dragover="dragover" @dragleave="dragleave" @drop="drop" >
        <div>
          <input 
            type="file" 
            id="assetsFieldHandle" 
            class="upload-photo center"
            @change="onChange"
            ref="myFileInput" 
            accept=".xls"
          >
          <label for="assetsFieldHandle" class="input-label">
            Перетащите сюда ваши файлы <strong :class="err ? 'danger' : 'none'">.xls</strong> или <span class="underline primary">кликните тут</span> чтобы загрузить их
          </label>
        </div>
        <div class="card mt-1 list-item file alert" v-if="file !== null" >
          {{ file.name }} <button  class="btn danger" type="button" @click="remove">Удалить</button>
        </div>
        <button class="btn primary mt-1" @click="$emit('submit')" :disabled="isDisabled">Начать</button>
    </div>
</template>

<script>


export default {
    name: 'fileInput',
    data: () => ({
        err: false,
    }),
    inject: [
        'response',
        'showAnimation',
        'file'
    ],
    methods: {
        onChange() {
            let newFile = this.$refs.myFileInput.files[0];
            if (!newFile) {
                return
            }

            if (newFile.name.endsWith('.xls')) {
                this.err = false
                this.$emit('fileChange', newFile)
            } else {
                this.err = true
            }
        },
        remove() {
            this.$refs.myFileInput.value = null
            this.$emit('fileChange', null)
        },
        dragover(event) {
            event.currentTarget.style.opacity = 0.5
        },
        dragleave(event) {
            event.currentTarget.style.opacity = 1
        },
        drop(event) {
            event.preventDefault();
            this.$refs.myFileInput.files = event.dataTransfer.files;
            this.dragleave(event)
            this.onChange()
        },
        handleFileName(name) {
            if (name.length >= 14) {
                return name.slice(11) + '...'
            } else {
                return name
            }
        },
    },
    computed: {
        isDisabled() {
            return this.file == null || this.showAnimation || !this.response
        },
    }
}

</script>