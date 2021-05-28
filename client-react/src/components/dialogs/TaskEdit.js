import React, {useEffect, useContext} from 'react';
import {useObj} from "../../hooks/editObj.hook";
import { SingleDatePicker } from "react-google-flight-datepicker";
import {TaskContext} from "../../contextes/TaskContext";

export const TaskEditDialog = React.memo(({show, closeDialog, currentUser, task, subordinates}) => {

  const disableEdit = task.creatorId && task.creatorId !== currentUser.id;
  const defaultValues = {
    status: 'К выполнению',
    priority: 'Низкий',
    expirationDate: new Date().toISOString(),
    creatorId: currentUser.id,
    responsibleId: currentUser.id,
  }
  const { obj, onChange, setCustomVal, resetObj } = useObj(task); //Внутренний объект для редактирования задачи
  useEffect(() => {
    resetObj(task, defaultValues);
  }, [task]);//При изменении задачи у родителя, заменяем задачу в всплывайке

  const {loadingTasks, createOrUpdateTask} = useContext(TaskContext);
  const saveAndClose = async () => {
    const res = await createOrUpdateTask(obj);
    if (res)
      closeDialog();
  }

  let modalClasses = ['modal', 'fade'];
  let modalFooterClasses = ['modal-footer'];
  if (show) {
    modalClasses.push('show');
  }
  if (loadingTasks) {
    modalFooterClasses.push('justify-content-center')
  }

  return (
    <>
      <div
        className={modalClasses.join(' ')}
        tabIndex="-1"
        style={{display: show ? 'block' : 'none'}}
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">{task.id ? 'Редактирование ' : 'Создание '}задачи</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeDialog}/>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Название</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={obj.title || ''}
                  onChange={onChange}
                  disabled={disableEdit}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Описание</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={obj.description || ''}
                  onChange={onChange}
                  rows="4"
                  disabled={disableEdit}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Приоритет</label>
                <select
                  className="form-select"
                  name="priority"
                  value={obj.priority || ''}
                  onChange={onChange}
                  disabled={disableEdit}
                >
                  <option value="Низкий">Низкий</option>
                  <option value="Средний">Средний</option>
                  <option value="Высокий">Высокий</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Дата окончания</label>
                <SingleDatePicker
                  startDate={obj.expirationDate || new Date()}
                  onChange={(startDate) => setCustomVal('expirationDate', startDate.toISOString())}
                  minDate={new Date(1900, 0, 1)}
                  maxDate={new Date(2100, 0, 1)}
                  dateFormat="DD.MM.YYYY"
                  monthFormat="MMM YYYY"
                  className="task-date-picker"
                  startDatePlaceholder="Дата окончания"
                  startWeekDay="monday"
                  singleCalendar={true}
                  disabled={disableEdit}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Статус</label>
                <select
                  className="form-select"
                  name="status"
                  value={obj.status || 'К выполнению'}
                  onChange={onChange}
                >
                  <option value="К выполнению">К выполнению</option>
                  <option value="Выполняется">Выполняется</option>
                  <option value="Выполнена">Выполнена</option>
                  <option value="Отменена">Отменена</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Дата создания</label>
                <input
                  type="text"
                  className="form-control"
                  name="createdAt"
                  value={obj.createdAt ? new Date(Date.parse(obj.createdAt)).toLocaleDateString('ru-RU') : ''}
                  disabled={true}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Дата последнего изменения</label>
                <input
                  type="text"
                  className="form-control"
                  name="updatedAt"
                  value={obj.updatedAt ? new Date(Date.parse(obj.updatedAt)).toLocaleDateString('ru-RU') : ''}
                  disabled={true}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Создатель</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentUser.fio || ''}
                  disabled={true}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ответственный</label>
                <select
                  className="form-select"
                  name="responsibleId"
                  value={obj.responsibleId || currentUser.id || ''}
                  onChange={onChange}
                  disabled={disableEdit}
                >
                  {subordinates.map(subordinate => {
                    return (
                      <option key={subordinate.id} value={subordinate.id}>{subordinate.fio}</option>
                    )
                  })}
                </select>
              </div>

            </div>
            <div className={modalFooterClasses.join(' ')}>
              {loadingTasks ? (
                <div className="text-center">
                  <div className="spinner-border" style={{width: '3rem', height: '3rem'}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <button type="button" className="btn btn-primary" onClick={saveAndClose}>Сохранить</button>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeDialog}>Закрыть</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{display: show ? 'block' : 'none'}}
      />
    </>
  )
})