<template>
    <div class="center" @dragover="dragover" @dragleave="dragleave" @drop="drop" >
        <div>
          <input 
            type="file" 
            id="assetsFieldHandle" 
            class="upload-photo center"
            @change="onChange" 
            ref="file" 
            accept=".xls" 
          >
          <label for="assetsFieldHandle" class="input-label">
            Перетащите сюда ваши файлы <strong :class="err ? 'danger' : 'none'">.xls</strong> или <span class="underline primary">кликните тут</span> чтобы загрузить их
          </label>
        </div>
        <div class="card mt-1 list-item file alert" v-if="file !== null" >
          {{ file.name }} <button  class="btn danger" type="button" @click="remove">Удалить</button>
        </div>
        <button class="btn primary mt-1" @click="startRequest" :disabled="isDisabled">Начать</button>
    </div>
</template>

<script>


export default {
    name: 'fineInput',
    data: () => ({
        file: null,
        err: false,
    }),
    props: [
        'startRequest',
        'setNewFile'
    ],
    inject: [
        'response',
        'showAnimation'
    ],

    methods: {
        onChange() {
            let newFile = this.$refs.file.files[0];
            if (!newFile) {
                return
            }

            if (newFile.name.endsWith('.xls')) {
                this.file = newFile;
                this.err = false
                this.setNewFile(newFile)
            } else {
                this.err = true
            }
        },
        remove() {
            this.file = null
        },
        dragover(event) {
            event.currentTarget.style.opacity = 0.5
        },
        dragleave(event) {
            event.currentTarget.style.opacity = 1
        },
        drop(event) {
            event.preventDefault();
            this.$refs.file.files = event.dataTransfer.files;
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