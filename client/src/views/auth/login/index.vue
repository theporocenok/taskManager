<template>
  <v-layout align-center justify-center style="height: 100%">
    <v-form ref="loginForm" lazy-validation>
      <v-card class="login-form">
        <v-card-title class="mb-0 pb-0"> Вход </v-card-title>
        <v-card-text class="pt-0">
          <v-text-field
            v-model="form.login"
            label="Логин"
            :rules="rules.notEmpty"
          />
          <v-text-field
            v-model="form.password"
            label="Пароль"
            type="password"
            class="pt-0"
            :rules="rules.notEmpty"
            @keyup.enter="logIn"
          />
          <v-btn @click="logIn" color="primary" class="mt-2" width="100%">
            Войти
          </v-btn>
          <v-fade-transition>
            <div v-if="error" class="font-weight-bold red--text mt-2">
              {{ error }}
            </div>
          </v-fade-transition>
        </v-card-text>
      </v-card>
    </v-form>
  </v-layout>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        login: "",
        password: "",
      },
      error: "",
      rules: {
        notEmpty: [(val) => !!val || "Обязательно для заполнения"],
      },
    };
  },
  methods: {
    async logIn() {
      if (!this.$refs.loginForm.validate()) {
        return;
      }
      this.error = "";
      let data = await this.$request("/auth/login", "POST", this.form);
      switch (data.status) {
        case 200:
          this.$cookies.set('jwt', data.data.token, '1d' );
          this.$router.push("/tasks");
          break;
        case 403:
          this.error = data.data.message;
          break;
        default:
          this.error = "Ошибка при попытке авторизации";
          break;
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  min-width: 350px;
}
</style>
