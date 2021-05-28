import React, {useState} from 'react'
import {useEditDialog} from "../hooks/editItemDialog.hook";
import {useUser} from "../hooks/requests/user.hook";
import {useSubordinates} from "../hooks/requests/subordinates.hook";
import {useTask} from "../hooks/requests/task.hook";
import {TaskContext} from "../contextes/TaskContext";
import {TaskEditDialog} from "../components/dialogs/TaskEdit";
import {ConfirmDialog} from "../components/dialogs/Confirm";
import {TaskFilters} from "../components/TaskFilters";

export const TasksPage = () => {
  const { isDialogOpened, editableItem, openDialog, closeDialog } = useEditDialog();
  const currentUser = useUser();
  const subordinates = useSubordinates();
  const { tasks, loadingTasks, deleteTask, createOrUpdateTask, reloadTasks } = useTask();

  const [ taskToDelete, setTaskToDelete ] = useState({});
  const [ isConfirmDialogOpened, toggleConfirmDialog ] = useState(false);
  const confirmDeleteTask = (event, task) => {
    event.stopPropagation();
    setTaskToDelete(task);
    toggleConfirmDialog(true);
  }
  const deleteTaskAfterConfirmation = () => {
    deleteTask(taskToDelete);
    setTaskToDelete({});
    toggleConfirmDialog(false);
  }

  return (
    <TaskContext.Provider
      value={{loadingTasks, createOrUpdateTask}}
    >
      <div className="pt-4">
        <h1 className="mb-5">Tasks Page</h1>
        <TaskFilters
          subordinates={subordinates}
          refresh={reloadTasks}
          newTask={() => openDialog()}
        />
        {loadingTasks && !isDialogOpened ? (
          <div className="text-center">
            <div className="spinner-border" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="table">
            <thead>
            <tr>
              <th scope="col">Заголовок</th>
              <th scope="col">Приоритет</th>
              <th scope="col">Дата окончания</th>
              <th scope="col">Ответственный</th>
              <th scope="col">Статус</th>
              <th scope="col">Действия</th>
            </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ?
                tasks.map(task =>
                    <tr
                      key={task.id}
                      className={getItemColor(task)}
                      onClick={() => openDialog(task)}
                    >
                      <td>{task.title}</td>
                      <td>{task.priority}</td>
                      <td>{new Date(Date.parse(task.expirationDate)).toLocaleDateString('ru-RU')}</td>
                      <td>{task.responsible?.fio}</td>
                      <td>{task.status}</td>
                      <td>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          fill="#8a8a8a"
                          style={{cursor: 'pointer'}}
                          className="bi bi-pencil-fill me-2" viewBox="0 0 16 16"
                          onClick={() => openDialog(task)}
                        >
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                        {currentUser.id === task.creatorId && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="#ff5252"
                            className="bi bi-x-octagon" viewBox="0 0 16 16"
                            style={{cursor: 'pointer'}}
                            onClick={(event) => confirmDeleteTask(event, task)}
                          >
                            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                          </svg>
                        )}
                      </td>
                    </tr>
                  )
              : (
                <tr className='table-secondary'>
                  <td colSpan="6" className="text-center">
                    Нет задач
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <TaskEditDialog
          task={editableItem}
          show={isDialogOpened}
          currentUser={currentUser}
          subordinates={subordinates}
          closeDialog={ () => { closeDialog() }}
        />
        <ConfirmDialog
          show={isConfirmDialogOpened}
          successAction={deleteTaskAfterConfirmation}
          closeDialog={() => toggleConfirmDialog(false)}
        />
      </div>
    </TaskContext.Provider>
  )
}

function getItemColor(item) {
  if (new Date(Date.parse(item.expirationDate)) < new Date() && item.status !== 'Выполнена') {
    return 'table-danger';
  }
  if (item.status === 'Выполнена') {
    return 'table-success';
  }
  return 'table-secondary';
}