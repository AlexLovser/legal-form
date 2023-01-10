<template>

    <div 
        class="iconed-button" 
        :style="{'background-color': buttonColor}"
        @click="onClick"
    >
        <unicon 
            v-if="icon_name !== undefined"
            :name="icon_name" 
            :fill="iconColor" 
            height="25" width="25" 
        >
        </unicon>
        <span :style="{'color': iconColor, 'margin-left': this.color !== undefined ? '0.5rem' : '0rem'}">
            {{ title }}
        </span>
        
    </div>

</template>
<script>
import './iconedButton.css';


export default {
    name: 'iconedButton',
    props: ['icon_name', 'color', 'title'],
    setup(props) {
        const backgroundColor = () => {
            switch (props.color) {
                case 'primary': return '#42b983'
                case 'danger': return '#e53935'
                case 'warning': return '#c25205'
                case 'plain': return '#8c8989'
                case undefined: return 'none'
                default: return this.color
            }
        }

        return {
            buttonColor: backgroundColor(),
            iconColor: props.color !== undefined ? '#fff' : '#000',
        }


    },
}
</script>