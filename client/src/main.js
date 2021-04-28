import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import cookies from 'vue-cookies';
import store from "./store";
import vuetify from "./plugins/vuetify";
import request from "./plugins/request";

Vue.config.productionTip = false;
Vue.use(request);
Vue.use(cookies);

Vue.$cookies.config('1d');

router.beforeEach((to, from, next) => {
  let hasToken = cookies.get('jwt');
  if (to.name !== "auth" && !hasToken) {
    next("/auth/login");
    return;
  }
  if (to.name === "auth" && hasToken) {
    next("/tasks");
    return;
  }
  next();
});

new Vue({
  router,
  cookies,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");