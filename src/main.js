
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import store from './store'

axios.defaults.baseURL = 'http://127.0.0.1:10888'

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
  })

app.use(router)
app.use(vuetify)
app.use(store)

app.config.globalProperties.$axios = axios;

// 权限判断方法
app.config.globalProperties.$hasPermission = function(permission) {
	let permissions = this.$store.state['permissions'];
	for(let i=0;i<permissions.length;i++){
		if(permissions[i].includes(permission)){
			return true;
		}
	}
	return false;
};

app.mount('#app')
