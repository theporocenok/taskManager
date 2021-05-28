export const TaskReducer = (state, action) => {
  switch (action.type) {
    case 'create':
      console.log('creating', action.data);
      return state;
    case 'update':
      return state.map(task => {
        return task.id === action.data.id ? action.data : task;
      });
    case 'remove':
      return state.filter(task => {
        return task.id !== action.data.id;
      });
    case 'reload':
      state = action.data;
      return state;
    default:
      return state;
  }
}