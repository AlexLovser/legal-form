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
            <a @click="$forceUpdate()">Вернуться на главную</a>
        </span>
        <hr />
        <a href="$forceUpdate()">Вернуться на главную</a>
    </div>
    
</template>

<script>

export default {
    name: 'errorLable',
    props: ['serverError']
}

</script>
