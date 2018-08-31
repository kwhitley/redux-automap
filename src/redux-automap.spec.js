import { expect } from 'chai'
import { default as reduxAutomapES6, automap, merge } from './redux-automap'

const reduxAutomapCJS = require('./redux-automap')
const automapCJS = reduxAutomapCJS.automap
const mergeCJS = reduxAutomapCJS.merge

// SAMPLE CONFIG
let todosState = { items: [], category: 'dogs' }
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
let sampleConfig = { namespace: 'foo', initialState: todosState, actionReducers }
// END: SAMPLE CONFIG

describe('"require" vs "import"', function() {
  it('both return same default', function() {
    expect(typeof reduxAutomapES6.automap).to.equal('function')
    expect(typeof reduxAutomapCJS.automap).to.equal('function')
  })

  it('both return named exports', function() {
    expect(typeof automap).to.equal('function')
    expect(typeof automapCJS).to.equal('function')
  })

  it('both automap functions function minimally', function() {
    let config = { namespace: 'foo' }
    let mappedES6 = automap(config)
    let mappedCJS = automapCJS(config)

    expect(mappedCJS.namespace).to.equal(mappedES6.namespace)
  })
})

describe('automap({ namespace, actionReducers, initialState }): object', function() {
  let todos = automap(sampleConfig)

  it('reducer throws when no action passed', function() {
    expect(todos.reducer).to.throw()
  })

  it('reducer delivers initialState if no matching action found', function() {
    expect(todos.reducer(undefined, {})).to.equal(todosState)
  })

  it('exports actions approporiately', function() {
    expect(typeof todos.actions.addTodo).to.equal('function')
  })

  it('actions creators create action objects', function() {
    expect(todos.actions.addTodo('miffles')).to.eql({ type: 'ADD_TODO', text: 'miffles' })
  })

  it('actions creators may be registered without a reducer (e.g. for use with side effects)', function() {
    let state = 'test'
    let missingAction = todos.actions.missing()
    let newState = todos.reducer(state, missingAction)

    expect(missingAction).to.eql({ type: 'MISSING' })
    expect(state).to.equal(newState)
  })

  it('may register multiple action creators to a single reducer', function() {
    expect(typeof todos.actions.setCategory).to.equal('function')
    expect(typeof todos.actions.setCategoryFoo).to.equal('function')
  })

  it('reducer works as intended', function() {
    let { addTodo, clearTodos } = todos.actions
    let miffles = addTodo('miffles')
    let vlad = addTodo('vlad')
    let clearAction = clearTodos()
    let state = { items: [], category: undefined }

    state = todos.reducer(state, miffles)
    expect(state.items).to.eql(['miffles'])

    state = todos.reducer(state, vlad)
    expect(state.items).to.eql(['miffles', 'vlad'])

    state = todos.reducer(state, clearAction)
    expect(state.items).to.eql([])
  })

  it('multiple actions sharing one reducer works as intended', function() {
    let { setCategory, setCategoryFoo } = todos.actions
    let state = { items: [], category: 'start' }

    expect(state.category).to.equal('start')
    expect(state.items).to.eql([])

    state = todos.reducer(state, setCategory('cats'))
    expect(state.category).to.equal('cats')

    state = todos.reducer(state, setCategoryFoo())
    expect(state.category).to.equal('foo')
  })

  it('maps actions onto root if no conflicts', function() {
    expect(typeof todos.addTodo).to.equal('function')
    expect(todos.addTodo).to.equal(todos.actions.addTodo)
  })
})

describe('merge([ maps ]): object', function() {
  let todos = automap(sampleConfig)
  let merged = merge([ todos ])
  console.log('merged', merged)

  it('merges maps into { namespace: reducer(state, action) } format for use in rootReducer/combineReducers', function() {
    expect(typeof merged.foo).to.equal('function')
  })
})
