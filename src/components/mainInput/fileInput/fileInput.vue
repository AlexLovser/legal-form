<template>
    <div class="row">
        <input type="file" @input="handleFileChange" style="display: none" :id="custom_id"/>
        <button class="btn" @click="handlePress">
            <unicon name="database" fill="#3eaf7c" ></unicon> {{title}}
        </button>
    </div>
</template>


<script>
import "../mainInput.css";

export default {
    name: 'fileInput',
    props: [
        'title',
        'value'
    ],
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
            let target = e.target.files ? e.target.files[0] : null
            this.$emit('input', target)
        }
    }
}
</script>
