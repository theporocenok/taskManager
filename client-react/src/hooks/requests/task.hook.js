import { useReducer, useCallback } from 'react';
import { TaskReducer } from "../../reducers/TaskReducer";
import {useRequest} from "../axios.hook";

export const useTask = () => {
  const [ tasks, dispatchTasks ] = useReducer(TaskReducer, []);
  const { loading, request } = useRequest();

  const reloadTasks = useCallback(async (filters) => {
    try {
      const data = await request('/tasks', 'GET', filters);
      dispatchTasks({
        type: 'reload',
        data: data.data,
      })
    } catch (e) {}
  }, [request]);

  const createTask = useCallback(async (task) => {
    try {
      await request('/tasks', 'POST', task);
      reloadTasks();
    } catch (e) {}
  }, [request, reloadTasks])

  const updateTask = useCallback(async (task) => {
    try {
      await request('/tasks/' + task.id, 'PUT', task);
      dispatchTasks({
        type: 'update',
        data: task,
      });
    } catch (e) {}
  }, [request])

  const deleteTask = useCallback(async (task) => {
    try {
      await request('/tasks/' + task.id, 'DELETE');
      dispatchTasks({
        type: 'remove',
        data: task,
      })
    } catch (e) {}
  }, [request]);

  const createOrUpdateTask = useCallback(async (task) => {
    try {
      if (task.id) {
        await updateTask(task);
      } else {
        await createTask(task);
      }
      return true;
    } catch (e) {}
  }, [updateTask, createTask]);

  return {
    loadingTasks: loading,
    tasks,
    createOrUpdateTask,
    deleteTask,
    reloadTasks
  }
}