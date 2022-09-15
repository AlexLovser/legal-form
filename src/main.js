import { createApp } from 'vue';
import App from './App.vue'; 
import Unicon from 'vue-unicons';
import { uniCopy, uniEnter, uniTimesCircle, uniTrashAlt, uniBoltAlt, uniRedo } from 'vue-unicons/dist/icons';


Unicon.add([ uniCopy, uniTimesCircle, uniEnter, uniTrashAlt, uniBoltAlt, uniRedo]);

const app = createApp(App)
app.config.unwrapInjectedRef = true
app
.use(Unicon)
.mount('#app');