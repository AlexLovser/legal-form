<template>
<div class="loading">
    <transition appear @appear="el => startAnim(el, 0)">
        <div class="btn primary"></div>
    </transition>
    <transition appear @appear="el => startAnim(el, 1)">
        <div class="btn primary"></div>
    </transition>
    <transition appear @appear="el => startAnim(el, 2)">
        <div class="btn primary"></div>
    </transition>
    <transition appear @appear="el => startAnim(el, 3)">
        <div class="btn primary"></div>
    </transition>
</div>
<h3>{{title}}...</h3>

</template>

<script>

import gsap from 'gsap';


export default {
    name: 'loadingAnimation',
    data: () => ({
        title: ''
    }),
    methods: {
        startAnim(el, to) {
            setTimeout(
                () => {
                    let loop = 0
                    let last = 'primary'
                    const styles = ['primary', 'warning', 'danger']
                    gsap.to(el, {
                        duration: 0.8,
                        height: 250,
                        repeat: -1,
                        yoyo: true,
                        repeatRefresh: 1000,
                        onRepeat: () => {
                            el.classList.remove(last)
                            last = styles[loop]
                            el.classList.add(last) 

                            loop ++
                            if (loop === 3) {
                                loop = 0
                            }
                        }
                    })
                }, ((to === 0 || to === 2) ? 0.8 : 0) * 1000
            )
        },
    },
    beforeMount() {
        const change = newName => {
            this.title = newName
        }
        new Promise(function(resolve) {
            setTimeout(() => {
                change('Getting information')
                resolve()
            }, 1000);
        }).then(function() {
        return new Promise(resolve => {
            setTimeout(
                () => {
                    change('Processing data')
                    resolve()
                }, 2000);
        });

        }).then(function() {

        return new Promise(resolve => {
            setTimeout(
                () => {
                    change('Analyzing')
                    resolve()
                }, 1000);
        });

        }).then(function() {

            return new Promise(resolve => {
                setTimeout(
                    () => {
                        change('Creating response')
                        resolve()
                    }, 2000);
            });

        });
                
    },
}



</script>
