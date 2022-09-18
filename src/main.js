import { createApp } from 'vue';
import App from './App.vue'; 
import Unicon from 'vue-unicons';
import { 
    uniCopy, 
    uniEnter, 
    uniTimesCircle, 
    uniTrashAlt, 
    uniBoltAlt, 
    uniRedo, 
    uniTimes,
    uniPlus,
    uniFileSlash,
    uniFileCheck
} from 'vue-unicons/dist/icons';
import { createPinia } from 'pinia/dist/pinia';

const pinia = createPinia();
	
Unicon.add([ 
    uniCopy, 
    uniTimesCircle, 
    uniEnter, 
    uniTrashAlt, 
    uniBoltAlt, 
    uniRedo, 
    uniTimes, 
    uniPlus,
    uniFileSlash,
    uniFileCheck
]);

const app = createApp(App);

app.config.unwrapInjectedRef = true;
app
.use(Unicon)
.use(pinia)
.mount('#app');