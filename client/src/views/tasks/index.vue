<template>
  <div>
    <div class="title">
      Список задач
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
  </div>
</template>

<script>
  import TaskEditDialog from "../../components/TaskEditDialog";
  export default {
    name: "tasks",
    components: {TaskEditDialog},
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
        subordinatesList: [],

        editDialog: false,
        editItem: null,
        addingTask: false,

        currentUser: {},
      }
    },
    computed: {

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
        let {data} = (await this.$request('/tasks', 'GET'));
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