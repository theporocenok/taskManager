<template>
  <v-dialog
    v-model="showDialog"
    width="500"
    content-class="r-dialog"
  >
    <div
            style="position: relative"
    >
      <v-btn
              height="40"
              width="40"
              min-width="0"
              depressed
              absolute
              dark
              rounded
              color="primary"
              class="r-dialog__close px-0"
              @click="$emit('close-dialog')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-card>
      <v-card-title class="headline lighten-2">
        {{ isNewTask ? 'Создание задачи' : 'Редактирование задачи' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="taskForm" lazy-validation>
          <v-text-field
            v-model="taskObj.title"
            :readonly="!isCreator && !isNewTask"
            label="Название"
          />
          <v-textarea
            v-model="taskObj.description"
            :readonly="!isCreator && !isNewTask"
            label="Описание"
          />
          <v-select
            v-model="taskObj.priority"
            :readonly="!isCreator && !isNewTask"
            label="Приоритет"
            :items="prioritiesList"
          />
          <v-menu
            ref="datePicker"
            :readonly="!isCreator && !isNewTask"
            v-model="datePicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="task_expiration_date"
                v-model="taskExpirationDate"
                label="Дата окончания"
                readonly
                :clearable="isCreator || isNewTask"
                v-bind="attrs"
                color="primary"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-if="isCreator || isNewTask"
              v-model="taskExpirationDatePicker"
              no-title
              locale="ru"
              color="primary"
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="datePicker = false"
              >
                Отмена
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="datePicker = false"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
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
            disabled
            label="Дата создания"
          />
          <v-text-field
            :value="taskUpdatedAt"
            readonly
            disabled
            label="Дата последнего изменения"
          />
          <v-text-field
            :value="creatorFio"
            label="Создатель"
            readonly
            disabled
          />
          <v-select
            v-model="taskObj.responsibleId"
            label="Ответственный"
            :readonly="currentUser.leaderId"
            :disabled="currentUser.leaderId"
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
          @click="saveTask"
        >
          {{ taskObj.id ? 'Сохранить' : 'Создать' }}
        </v-btn>
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
        datePicker: false,
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
      creatorFio: {
        get() {
          if (this.taskObj.creator) {
            return this.taskObj.creator.fio;
          }
          return '';
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
      taskExpirationDate: {
        get() {
          return this.taskExpirationDatePicker ? new Date(Date.parse(this.taskObj.expirationDate)).toLocaleDateString('ru-RU') : '';
        }
      },
      taskExpirationDatePicker: {
        get() {
          let date = this.taskObj.expirationDate ? this.taskObj.expirationDate : '';
          date = date.substr(0, 10);
          return date;
        },
        set(val) {
          this.$set(this.taskObj, 'expirationDate', val);
        }
      },
      isCreator: {
        get() {
          if (this.task && this.task.creatorId === this.currentUser.id) {
            return true;
          }
          return false;
        }
      }
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
          this.$set(this.taskObj, 'creator', this.currentUser);
          this.$set(this.taskObj, 'responsibleId', this.currentUser.id);
          this.$set(this.taskObj, 'responsibleId', this.currentUser.id);
          this.$set(this.taskObj, 'responsible', this.currentUser);
        }
      },
      closeModal() {
        this.taskObj = {};
      },
      async saveTask() {
        if (this.taskObj.id) {
          (await this.$request('/tasks/' + this.taskObj.id, 'PUT', this.taskObj));
        }else{
          (await this.$request('/tasks', 'POST', this.taskObj));
        }
        this.showDialog = false;
      }
    },
  }
</script>

<style>
  .r-dialog {
    box-shadow: unset !important;
    position: relative;
    height: 90%;
    overflow-y: unset !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .r-dialog__card {
    overflow-y: auto !important;
  }
  .r-dialog .v-card__text {
    max-height: 70vh;
    overflow-y: auto;
  }
  .r-dialog__close {
    position: absolute;
    top: -27px !important;
    right: -27px !important;
    z-index: 217;
  }
</style>