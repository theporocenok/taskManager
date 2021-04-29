<template>
  <v-dialog
          v-model="showDialog"
          max-width="370px"
          persistent
  >
    <div>
      <v-card
        :class="`d-flex flex-column overflow-hidden `"
      >
        <v-card-title
        >
          <div :class="`headline lighten-2 text-no-wrap`">
            Подтверждение действия
          </div>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col style="color: #222;">
              <template v-if="!custumText">
                Вы уверены, что желаете <span :style="`color: ${confirmTextColorComputed}`">{{ confirmText }}</span>
              </template>
              <template v-else>
                <span :style="`color: ${confirmTextColorComputed}`">{{ confirmText }}</span>
              </template>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-spacer />
            <v-col class="px-0">
              <v-btn
                :color="confirmBtnColorComputed"
                dark
                class="text-none"
                @click="$emit('accept')"
              >
                {{ confirmBtnText }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                v-if="showDeclineBtn"
                color="primary"
                outlined
                class="text-none"
                @click="$emit('decline')"
              >
                Отмена
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
  export default {
    name: "ConfirmDialog",
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      confirmText: {
        type: String,
        default: () => {
          return '';
        }
      },
      confirmTextColor: {
        type: String,
        default: '',
      },
      confirmBtnText: {
        type: String,
        default: () => {
          return 'Продолжить';
        }
      },
      confirmBtnColor: {
        type: String,
        default: '',
      },
      custumText: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      showDeclineBtn: {
        type: Boolean,
        default: () => {
          return true;
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      showDialog: {
        get() {
          return this.dialog;
        },
        set() {
          this.$emit('close-dialog');
        }
      },
      confirmTextColorComputed() {
        if (this.confirmTextColor !== '') {
          return this.confirmTextColor;
        }
        return 'primary';
      },
      confirmBtnColorComputed() {
        if (this.confirmBtnColor !== '') {
          return this.confirmBtnColor;
        }
        return 'primary';
      },
    },
  }
</script>

<style scoped>
</style>