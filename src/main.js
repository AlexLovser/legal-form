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
    uniFileCheck,
    uniCheck
} from 'vue-unicons/dist/icons';
import { createPinia } from 'pinia/dist/pinia';
import VueClipboard from 'vue-clipboard2';


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
    uniFileCheck,
    uniCheck
]);

const app = createApp(App);

VueClipboard.config.autoSetContainer = true;
app.config.unwrapInjectedRef = true;
app
.use(Unicon)
.use(pinia)
.use(VueClipboard)
.mount('#app');