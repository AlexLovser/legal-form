<template>
<div class="loading" v-cloak>
    <transition appear v-for="i in 5" @appear="el => startAnim(el, i-1)" :key="i" >
        <div class="btn default"></div>
    </transition>
</div>
<h3>{{possibleTitles[step]}}...</h3>
</template>

<script>

import gsap from 'gsap';


export default {
    name: 'loadingAnimation',
    props: ['step'],
    data: () => ({
        possibleTitles: ['Extracting data', 'Counting', 'Searching the court', 'Creating response'],
        loops: []
    }),
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
                }, (!(ind % 2) ? 0.8 : 0) * 1000
            )
        },
    },
    beforeUnmount() {
        for (let i of this.loops) {
            i.kill()
        }
    }
}



</script>
