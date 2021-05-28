import {createContext} from 'react'

export const TaskContext = createContext({
  loadingTasks: false,
  createOrUpdateTask: () => {},
})