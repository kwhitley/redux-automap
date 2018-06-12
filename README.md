Redux helper library to greatly reduce action+reducer definition boilerplate.
=======
#### Works with sagas, thunks, reselect, etc

[![npm version](https://badge.fury.io/js/redux-automap.svg)](https://www.npmjs.com/package/redux-automap)
[![node version support](https://img.shields.io/node/v/redux-automap.svg)](https://www.npmjs.com/package/redux-automap)
[![Build Status via Travis CI](https://travis-ci.org/kwhitley/redux-automap.svg?branch=master)](https://travis-ci.org/kwhitley/redux-automap)
[![Coverage Status](https://coveralls.io/repos/github/kwhitley/redux-automap/badge.svg?branch=master)](https://coveralls.io/github/kwhitley/redux-automap?branch=master)
[![NPM downloads](https://img.shields.io/npm/dt/redux-automap.svg?style=flat-square)](https://www.npmjs.com/package/redux-automap)

## Why?
Because much of the redux boilerplate (defining consts, logic in reducers to match actions to reducers, etc)
really isn't necessary if you define actions with matching reducers together.

## Usage
```js
import { automap } from 'redux-automap';

const todos = automap({
  initialState: [],
  actionReducers: [
    {
      addTodo: text => ({ type: 'ADD_TODO', text }),
      reducer: (state, action) => [ ...state, action.text ]
    },
    {
      clearTodos: () => ({ type: 'CLEAR_TODOS' }),
      reducer: state => []
    }
  ]
});

/*

todos === {
  actions: { // exposed for access to action creators
    addTodo,
    clearTodos
  }

  reducer: (state, action) // exposed as the main reducer for each branch
}


*/

const { addTodo, clearTodos } = todos.actions;
const washClothesAction = addTodo('wash clothes'); // { type: 'ADD_TODO', text: 'wash clothes' }
const foldClothesAction = addTodo('fold, clothes'); // { type: 'ADD_TODO', text: 'fold clothes' }


let state = [];
state = todos.reduce(state, washClothesAction); // state === [ 'wash clothes' ]
state = todos.reduce(state, foldClothesAction); // state === [ 'wash clothes', 'fold clothes' ]
state = todos.reduce(state, clearTodos());      // state === [ ]
```

#### Example (allows multiple actions routing through a shared reducer)
```js
import { automap } from 'redux-automap';

const category = automap({
  initialState: 'dogs',
  actionReducers: [
    {
      setCategory: category => ({ type: 'SET_CATEGORY', category }),
      setCategoryToBirds: () => ({ type: 'SET_CATEGORY', category: 'birds' }),
      reducer: (state, action) => action.category // both actions will use this shared reducer
    }
  ]
});

const { setCategory, setCategoryToBirds } = todos.actions;

let state = 'dogs';
state = todos.reduce(state, setCategory('cats'));  // state === 'cats'
state = todos.reduce(state, setCategoryToBirds()); // state === 'birds'
```

## Changelog
v1.1.0 - added ability for multiple actions paired to one reducer
v1.2.0 - added optional pass-through selector namespacing for use with combined reducers (docs to follow)

