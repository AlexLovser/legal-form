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
    uniFileSlash
} from 'vue-unicons/dist/icons';


Unicon.add([ 
    uniCopy, 
    uniTimesCircle, 
    uniEnter, 
    uniTrashAlt, 
    uniBoltAlt, 
    uniRedo, 
    uniTimes, 
    uniPlus,
    uniFileSlash
]);

const app = createApp(App);
app.config.unwrapInjectedRef = true;
app
.use(Unicon)
.mount('#app');