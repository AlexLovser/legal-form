<template>
    <div>
        {{errorTitle}}
        <hr />
        {{errorMessage}}
    </div>
    
</template>

<script>

export default {
    name: 'errorLable',
    inject: ['serverError'],
    computed: {
        errorTitle() {
            switch (this.serverError) {
                case 1:
                    return 'Ваш файл не валидный! Попробуйте этот...'
                case 2:
                    return 'Ошибка расчета!'
                default:
                    return '...'
            }
        },
        errorMessage() {
            switch (this.serverError) {
                case 1:
                    return 'asdf..'
                case 2:
                    return 'asdfas'
                default:
                    return '...'
            }
        }
    }
}



</script>
