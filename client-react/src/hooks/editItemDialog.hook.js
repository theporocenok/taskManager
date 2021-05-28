import {useState} from 'react';

export const useEditDialog = () => {
  const [ isDialogOpened, setIsDialogOpened ] = useState(false);
  const [ item, setItem ] = useState({});

  const openDialog = (itemToEdit = {}) => {
    setIsDialogOpened(true);
    setItem(itemToEdit);
  }

  const closeDialog = () => {
    setIsDialogOpened(false);
    setItem({});
  }
  return {
    isDialogOpened,
    editableItem: item,
    openDialog,
    closeDialog
  }
}