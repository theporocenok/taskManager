import cookies from 'vue-cookies';
import router from "./../router";

export default {
  install(Vue) {
    Vue.prototype.$request = async (url, method = 'GET', body) => {
      try {
        if (method === 'GET' && body) {
          url += '?' + new URLSearchParams(body).toString();
        }
        body = body && method !== 'GET' ? JSON.stringify(body) : undefined;
        return fetch(process.env.VUE_APP_MY_ENV_REQUEST_HOST + url, {
          method,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': cookies.get('jwt')
          },
          body
        })
          .then(response => {

            if (response.status === 401) {
              cookies.remove('jwt');
              router.push('/auth/login');
              return {};
            }
            return response.text().then(function(text) {
              return {
                status: response.status,
                data: text ? JSON.parse(text) : {},
              }
            })
          });
      } catch(e) {
        console.log('Request error: ', e);
      }
    }
  }
};