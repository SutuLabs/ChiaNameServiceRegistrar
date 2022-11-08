import { createApp } from "vue";
import App from "./App.vue";
import Notifications from '@kyvg/vue3-notification'
import "bulma/bulma.sass";
import "@mdi/font/css/materialdesignicons.css";
import "@scure/base";

createApp(App).use(Notifications).mount("#app");