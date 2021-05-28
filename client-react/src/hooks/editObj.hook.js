import { useState } from 'react';

export const useObj = (initialValue) => {
  const [obj, setObj] = useState(initialValue);

  const onChange = (event) => {
    setObj(prevState => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    });
  }

  const setCustomVal = (name, value) => {
    setObj(prevState => {
      return {
        ...prevState,
        [name]: value
      }
    })
  }

  const resetObj = (newObj, defaultValues = {}) => {
    newObj = Object.assign({}, defaultValues, newObj);
    setObj(newObj);
  }

  return {
    obj,
    onChange,
    setCustomVal,
    resetObj
  };
}