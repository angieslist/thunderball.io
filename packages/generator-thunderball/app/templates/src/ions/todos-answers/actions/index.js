import generateId from './generateId';
import { fetchTodos } from '../services/todosApi';

export const addTodo = (text, id = generateId(), completed = false) => ({
  type: 'ADD_TODO',
  id,
  text,
  completed,
});

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter,
});

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id,
});

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

export function fetchAndAddTodos() {
  return async (dispatch) => {
    try {
      const todos = await fetchTodos();
      todos.forEach((x) => {
        dispatch(addTodo(x.title, x.id, x.completed));
      });
    } catch (e) {
      // do nothing
    }
  };
}
