import { createApp } from 'vue';
import App from './App.vue'; 
import Unicon from 'vue-unicons';
import { uniCopy, uniPlusCircle, uniTimesCircle } from 'vue-unicons/dist/icons';


Unicon.add([ uniCopy, uniPlusCircle, uniTimesCircle]);

const app = createApp(App)
app.config.unwrapInjectedRef = true
app
.use(Unicon)
.mount('#app');