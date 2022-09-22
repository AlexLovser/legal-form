<template>
    <div class="row animation-field">
        <div class="row animation" v-cloak>
            <transition appear v-for="i in 5" @appear="el => startAnim(el, i-1)" :key="i" >
                <div :class="['btn', i == 1 ? 'primary' : 'default']"></div>
            </transition>
        </div>
        <strong>{{possibleTitles[step]}}...</strong>
    </div>
</template>

<script>
import { useMainStore } from '@/stores/mainStore';
import gsap from 'gsap';
import { watch } from 'vue';
import './loadingAnimation.css';

export default {
    name: 'loadingAnimation',
    props: ['step'],
    setup() {
        const store = useMainStore()
        watch(store.response, newOne => {
            if (Object.keys(newOne).length > 0) {
                this.finishAnim()
            }
        })

        return {
            possibleTitles: ['Extracting data', 'Counting', 'Searching the court', 'Creating response'],
            loops: []
        }
    },
    methods: {
        startAnim(el, ind) {
            setTimeout(
                () => {
                    this.loops.push(
                        gsap.to(el, {
                            duration: 0.8,
                            height: 250,
                            repeat: -1,
                            yoyo: true,
                            repeatRefresh: true,
                            onRepeat: () => {
                                if (ind <= this.step && !el.classList.contains('primary')) {
                                    el.classList.remove('default')
                                    el.classList.add('primary')
                                }
                                
                            }
                        })
                    )
                }, ((ind % 2) ? 0.8 : 0) * 1000
            )
        },
        finishAnim() {
            for (let i of this.loops) {
                i.kill()
            }
            this.loops = []
        },
    },
    beforeUnmount() {
        this.finishAnim()
    }
}



</script>
