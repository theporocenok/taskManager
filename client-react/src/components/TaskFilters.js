import React, {useState, useCallback, useEffect} from 'react';

export const TaskFilters = ({subordinates = [], refresh, newTask}) => {
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    subordinate: null,
  });

  const onChange = useCallback((event) => {
    setFilters(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    });
  }, []);

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const onChangeSelectedPeriod = useCallback((event) => {
    const id = parseInt(event.target.value);
    setSelectedPeriod(id);

    let today = new Date();
    let tomorrow = new Date((new Date()).setDate(today.getDate() + 1));
    let afterWeek = new Date((new Date()).setDate(today.getDate() + 7));
    switch (id) {
      case(1):
        setFilters(prevState => {
          return {
            ...prevState,
            dateFrom: today.toLocaleDateString('en-CA'),
            dateTo: tomorrow.toLocaleDateString('en-CA'),
          }
        });
        break;
      case(2):
        setFilters(prevState => {
          return {
            ...prevState,
            dateFrom: today.toLocaleDateString('en-CA'),
            dateTo: afterWeek.toLocaleDateString('en-CA'),
          }
        });
        break;
      case(3):
        setFilters(prevState => {
          return {
            ...prevState,
            dateFrom: afterWeek.toLocaleDateString('en-CA'),
            dateTo: null,
          }
        });
        break;
      default:
        setFilters(prevState => {
          return {
            ...prevState,
            dateFrom: null,
            dateTo: null,
          }
        });
    }
  }, [])

  useEffect(() => refresh(filters), [filters, refresh]);

  return (
    <div className="row mb-4">
      {subordinates.length > 1 && (
        <div className="col-3">
          <label className="form-label">Ответственный</label>
          <select
            className="form-select"
            name="subordinate"
            defaultValue={filters.subordinate || null}
            onChange={onChange}
          >
            <option value='null'>Выберите ответственного</option>
            {subordinates.map(subordinate => {
              return (
                <option key={subordinate.id} value={subordinate.id}>{subordinate.fio}</option>
              )
            })}
          </select>
        </div>
      )}
      <div className="col-3">
        <label className="form-label">Дата окончания</label>
        <select
          className="form-select"
          defaultValue={selectedPeriod || null}
          onChange={onChangeSelectedPeriod}
        >
          <option value="null">Выберите дату окончания</option>
          <option value="1">На сегодня</option>
          <option value="2">На неделю</option>
          <option value="3">На будущее</option>
        </select>
      </div>
      <div className="col d-flex justify-content-end align-items-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={newTask}
        >
          Новая задача
        </button>
      </div>
    </div>
  )
}