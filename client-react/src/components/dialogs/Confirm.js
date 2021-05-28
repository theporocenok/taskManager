import React from 'react';

export const ConfirmDialog = React.memo(({ show, closeDialog, successAction }) => {

  let modalClasses = ['modal', 'fade'];
  if (show) {
    modalClasses.push('show');
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
              <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeDialog}/>
            </div>
            <div className="modal-body">
              Вы уверены, что желаете удалить задачу?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={successAction}>Удалить</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeDialog}>Закрыть</button>
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