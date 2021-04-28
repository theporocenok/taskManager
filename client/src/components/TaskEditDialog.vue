<template>
  <v-dialog
    v-model="showDialog"
    width="500"
  >
    <v-card>
      <v-card-title class="headline lighten-2">
        {{ isNewTask ? 'Создание задачи' : 'Редактирование задачи' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="taskForm" lazy-validation>
          <v-text-field
            v-model="taskObj.title"
            label="Название"
          />
          <v-textarea
            v-model="taskObj.description"
            label="Описание"
          />
          <v-select
            v-model="taskObj.priority"
            label="Приоритет"
            :items="prioritiesList"
          />
          <v-select
            v-model="taskObj.status"
            label="Статус"
            :items="statusesList"
            item-value="text"
            item-text="text"
          />
          <v-text-field
            :value="taskCreatedAt"
            readonly
            label="Дата создания"
          />
          <v-text-field
            :value="taskUpdatedAt"
            label="Дата последнего изменения"
          />
          <v-text-field
            :value="currentUser.fio"
            label="Создатель"
            readonly
          />
          <v-select
            v-model="taskObj.responsibleId"
            label="Ответственный"
            :readonly="currentUser.leaderId"
            :items="subordinatesList"
            item-value="id"
            item-text="fio"
          />
        </v-form>
      </v-card-text>

      <v-divider/>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="primary"
          text
          @click="showDialog = false"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "TaskEditDialog",
    props: {
      dialog: {
        type: Boolean,
        default: () => {
          return false;
        }
      },
      currentUser: {
        type: Object,
        default: () => {
          return {};
        }
      },
      task: {
        type: Object,
        default: () => {
          return null;
        }
      },
      prioritiesList: {
        type: Array,
        default: () => {
          return [];
        }
      },
      statusesList: {
        type: Array,
        default: () => {
          return [];
        }
      },
      subordinatesList: {
        type: Array,
        default: () => {
          return [];
        }
      },
      isNewTask: {
        type: Boolean,
        default: () => {
          return false;
        }
      }
    },
    data() {
      return {
        taskObj: {},
      }
    },
    watch: {
      dialog(val) {
        if (val) {
          this.openModal();
        }
      }
    },
    computed: {
      showDialog: {
        get() {
          return this.dialog;
        },
        set() {
          this.closeModal();
          this.$emit('close-dialog');
        }
      },
      // taskTitle: {
      //   get() {
      //     return this.taskObj.title ?? '';
      //   },
      //   set(val) {
      //     this.$set(this.taskObj, 'title', val);
      //   }
      // },
      // taskDescription: {
      //   get() {
      //     return this.taskObj.description ?? '';
      //   },
      //   set(val) {
      //     this.$set(this.taskObj, 'description', val);
      //   }
      // },
      // taskExpirationDate: {
      //   get() {
      //     return this.taskObj.expirationDate ?? '';
      //   },
      //   set(val) {
      //     this.$set(this.taskObj, 'expirationDate', val);
      //   }
      // },
      // taskPriority: {
      //   get() {
      //     return this.taskObj.priority ?? '';
      //   },
      //   set(val) {
      //     this.$set(this.taskObj, 'priority', val);
      //   }
      // },
      taskCreatedAt: {
        get() {
          if (this.taskObj.createdAt) {
            return new Date(Date.parse(this.taskObj.createdAt)).toLocaleDateString('ru-RU');
          }
          return '';
        },
      },
      taskUpdatedAt: {
        get() {
          if (this.taskObj.updatedAt) {
            return new Date(Date.parse(this.taskObj.updatedAt)).toLocaleDateString('ru-RU');
          }
          return '';
        },
      },
    },
    mounted() {
      // this.loadData();
    },
    methods: {
      openModal() {
        this.$set(this, 'taskObj', Object.assign({}, this.task));
        if (this.isNewTask) {
          this.$set(this.taskObj, 'creatorId', this.currentUser.id);
          this.$set(this.taskObj, 'creatorId', this.currentUser.id);
        }
      },
      closeModal() {
        this.taskObj = {};
      }
      // async loadData(){
      //     let {data} = (await this.$model.SettingGroups.methods.all()).data;
      // },
    },
  }
</script>

<style scoped>

</style>