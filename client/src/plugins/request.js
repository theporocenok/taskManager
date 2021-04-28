export default {
  install(Vue) {
    Vue.prototype.$request = async (url, method = 'GET', body) => {
      try {
        body = body ? JSON.stringify(body) : undefined;
        return fetch(process.env.VUE_APP_MY_ENV_REQUEST_HOST + url, {
          method,
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body
        })
          .then(response => {
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