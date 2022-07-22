import { createApp } from 'vue';
import App from './App.vue';
import Unicon from 'vue-unicons';
import { uniLayerGroupMonochrome, uniCopy } from 'vue-unicons/dist/icons';

Unicon.add([uniLayerGroupMonochrome, uniCopy]);

createApp(App).use(Unicon).mount('#app');