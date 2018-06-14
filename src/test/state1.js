import { automap } from '../redux-automap'

let initialState = { items: [], category: 'dogs' }

let actionReducers = [
  {
    addTodo: (text) => ({ type: 'ADD_TODO', text }),
    reducer: (state, action) => {
      state.items = [ ...state.items, action.text]

      return state
    }
  },
  {
    clearTodos: () => ({ type: 'CLEAR_TODOS' }),
    reducer: (state, action) => {
      state.items = []

      return state
    }
  },
  {
    missing: () => ({ type: 'MISSING' })
  },
  {
    setCategory: (category) => ({ type: 'SET_CATEGORY', category }),
    setCategoryFoo: () => ({ type: 'SET_CATEGORY', category: 'foo' }),
    reducer: (state, action) => {
      state.category = action.category

      return state
    }
  },
]

return automap({ namespace: 'foo', initialState, actionReducers })
