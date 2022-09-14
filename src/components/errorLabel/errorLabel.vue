<template>
    <div>
        <span v-if="serverError === 1">
            Ваш файл не валидный! Попробуйте этот...
            <a href="образец.xls" class="underline" download>Нажмите чтобы скачать образец</a>
        </span>
        <span v-else-if="serverError === 2">
            Ошибка расчета!
        </span>
        <span v-else>
            Непредвиденная ошибка!
        </span>
        <hr />
        <a href=''>Вернуться на главную</a>
    </div>
    
</template>

<script>

export default {
    name: 'errorLable',
    props: ['serverError']
}

</script>
