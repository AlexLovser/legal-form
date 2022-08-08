import { createApp } from 'vue';
import App from './App.vue'; 
import Unicon from 'vue-unicons';
import { uniLayerGroupMonochrome, uniCopy } from 'vue-unicons/dist/icons';


Unicon.add([uniLayerGroupMonochrome, uniCopy]);

const app = createApp(App)
app.config.unwrapInjectedRef = true
app
.use(Unicon)
.mount('#app');