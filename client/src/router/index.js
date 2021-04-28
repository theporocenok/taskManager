import Vue from "vue";
import VueRouter from "vue-router";
import login from "../views/auth/login"
import tasks from "../views/tasks"

Vue.use(VueRouter);

const routes = [
  {
    path: "/auth/login",
    name: "auth",
    component: login,
  },
  {
    path: "/tasks",
    name: "tasks",
    component: tasks,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
