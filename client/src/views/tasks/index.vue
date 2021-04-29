<template>
  <div>
    <div class="title">
      Список задач
    </div>
    <div class="my-3">
      <v-layout align-center justify-space-between>
        <v-row>
          <v-col cols="4" v-if="subordinatesList.length > 1">
            <v-select
              v-model="filters.subordinate"
              label="Ответственный"
              :items="subordinatesList"
              item-value="id"
              item-text="fio"
              clearable
              class="mr-3"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="filterDates"
              label="Дата завершения"
              :items="expirationDatesList"
              item-value="id"
              item-text="text"
              clearable
            />
          </v-col>
        </v-row>
        <v-spacer/>
        <div>
          <v-btn
            color="primary"
            @click="openTaskEditDialog()"
          >
            Новая задача
          </v-btn>
        </div>
      </v-layout>
    </div>
    <v-data-table
      :items="tasksList"
      :headers="taskHeaders"
      :item-class="getItemColor"
      @dblclick:row="(mouseEvent, row) => openTaskEditDialog(row.item)"
    >
      <template v-slot:item.responsible="{item}">
        {{item.responsible.fio}}
      </template>
      <template v-slot:item.expirationDate="{item}">
        {{ new Date(Date.parse(item.expirationDate)).toLocaleDateString('ru-RU') }}
      </template>
      <template v-slot:item.actions="{item}">
        <v-btn
          color="green accent-3"
          text
          min-width="0"
          width="32"
          class="mr-2"
          @click="openTaskEditDialog(item)"
        >
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          color="error"
          text
          min-width="0"
          width="32"
          @click="confirmDeleting(item)"
        >
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <TaskEditDialog
      :dialog="editDialog"
      :current-user="currentUser"
      :statuses-list="statuses"
      :priorities-list="priorities"
      :subordinates-list="subordinatesList"
      :task="editItem"
      :is-new-task="addingTask"
      @close-dialog="closeTaskEditDialog"
    ></TaskEditDialog>
    <ConfirmDialog
      :dialog="showConfirmDialog"
      confirm-text="удалить задачу?"
      confirm-btn-text="Удалить"
      @accept="deleteTask"
      @decline="showConfirmDialog = false"
    />
  </div>
</template>

<script>
  import TaskEditDialog from "../../components/TaskEditDialog";
  import ConfirmDialog from "../../components/ConfirmDialog";
  export default {
    name: "tasks",
    components: {ConfirmDialog, TaskEditDialog},
    props: {

    },
    data() {
      return {
        tasksList: [],
        taskHeaders: [
          {text: 'Заголовок', value: 'title', sortable: false},
          {text: 'Приоритет', value: 'priority', sortable: false},
          {text: 'Дата окончания', value: 'expirationDate', sortable: false},
          {text: 'Ответственный', value: 'responsible', sortable: false},
          {text: 'Статус', value: 'status', sortable: false},
          {text: 'Действия', value: 'actions', sortable: false, width: '150px'},
        ],
        statuses: [
          { text: 'К выполнению' },
          { text: 'Выполняется' },
          { text: 'Выполнена' },
          { text: 'Отменена' }
        ],
        priorities: [
          { text: 'Высокий' },
          { text: 'Средний' },
          { text: 'Низкий' },
        ],
        expirationDatesList: [
          {id: 1, text: 'На сегодня'},
          {id: 2, text: 'На неделю'},
          {id: 3, text: 'На будущее'},
        ],
        expirationDateId: null,
        subordinatesList: [],

        editDialog: false,
        editItem: null,
        addingTask: false,

        currentUser: {},
        showConfirmDialog: false,

        filters: {
          dateFrom: null,
          dateTo: null,
          subordinate: null,
        }
      }
    },
    computed: {
      filterDates: {
        get() {
          return this.expirationDateId;
        },
        set(val) {
          if (!val) {
            this.filters.dateFrom = null;
            this.filters.dateTo = null;
            return;
          }

          let today = new Date();
          let tomorrow = new Date((new Date()).setDate(today.getDate() + 1));
          let afterWeek = new Date((new Date()).setDate(today.getDate() + 7));
          switch (val) {
            case(1):
              this.filters.dateFrom = today.toLocaleDateString('en-CA');
              this.filters.dateTo = tomorrow.toLocaleDateString('en-CA');
              break;
            case(2):
              this.filters.dateFrom = today.toLocaleDateString('en-CA');
              this.filters.dateTo = afterWeek.toLocaleDateString('en-CA');
              break;
            case(3):
              this.filters.dateFrom = afterWeek.toLocaleDateString('en-CA');
              this.filters.dateTo = null;
              break;
            default:
              this.filters.dateFrom = null;
              this.filters.dateTo = null;
          }
        }
      }
    },
    watch: {

      filters: {
        handler() {
          this.loadTasks();
        },
        deep: true
      }
    },
    mounted() {
      this.getMe();
      this.loadTasks();
      this.loadSubordinates();
    },
    methods: {
      async getMe() {
        let {data} = (await this.$request('/auth/me', 'GET'));
        this.currentUser = data;
      },
      async loadTasks(){
        let {data} = (await this.$request('/tasks', 'GET', this.filters));
        this.tasksList = data.data;
      },
      async loadSubordinates(){
        let {data} = (await this.$request('/users', 'GET'));
        this.subordinatesList = data.subordinates;
      },
      openTaskEditDialog(item = null) {
        if (item) {
          this.editItem = item;
        }else{
          this.addingTask = true;
        }
        this.editDialog = true;
      },
      closeTaskEditDialog(){
        this.loadTasks();
        this.editDialog = false;
        this.addingTask = false;
        this.editItem = null;
      },
      confirmDeleting(item) {
        this.editItem = item;
        this.showConfirmDialog = true;
      },
      async deleteTask() {
        this.showConfirmDialog = false;
        (await this.$request('/tasks/' + this.editItem.id, 'DELETE'));
        this.editItem = null;
        await this.loadTasks();
      },
      getItemColor(item) {
        if (new Date(Date.parse(item.expirationDate)) < new Date() && item.status !== 'Выполнена') {
          return 'task--red';
        }
        if (item.status === 'Выполнена') {
          return 'task--green';
        }
        return 'task--grey';
      }
    },
  }
</script>

<style>
  .task--red,
  .task--red:hover {
    background-color: rgba(255, 0, 0, .2) !important;
  }
  .task--green,
  .task--green:hover {
    background-color: rgba(0, 255, 0, .2) !important;
  }
  .task--grey,
  .task--grey:hover {
    background-color: rgba(166, 166, 166, .2) !important;
  }
</style>