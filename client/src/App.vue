<template>
  <v-app>
    <v-app-bar app color="primary" dark>

      <v-spacer></v-spacer>

      <v-btn
              v-if="$cookies.get('jwt')"
        text
        @click="logout"
      >
        <span class="mr-2">Выход</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container style="height: 100%">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "App",

  components: {
  },

  data: () => ({
    //
  }),
  mounted() {

  },
  methods: {
    async logout() {
      await this.$request('/auth/logout', 'POST');
      this.$cookies.remove('jwt');
      this.$router.push('/auth/login');
    }
  }
};
</script>
