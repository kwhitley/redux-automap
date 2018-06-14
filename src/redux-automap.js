// automap(namespace, { actionReducers, initialState }) - returns individual mapped actions/reducers/etc
export const automap = function(config = {}) {
  const { namespace, actionReducers = [], initialState = {}, selectors = {} } = config
  const anyAction = key => key !== 'reducer' && key !== 'type'

  const actions = actionReducers.reduce((acc, item) => {
    let actions = Object.keys(item).filter(anyAction)

    actions.forEach(actionKey => acc[actionKey] = item[actionKey])

    return acc
  }, {})

  const reducers = actionReducers.reduce((acc, item) => {
    let actionKey = Object.keys(item).find(anyAction)
    let reducerKey = item.type

    if (!reducerKey) {
      // try to pull name from action
      let action = item[actionKey]
      let actionResult = typeof action === 'function' && item[actionKey]() || {}
      reducerKey = typeof actionResult === 'object' && actionResult.type
    }

    acc[reducerKey] = item.reducer

    return acc
  }, {})

  const reducer = (state = initialState, action) => {
    if (!action) {
      throw new Error('redux-automap: no action passed to reducer(state, action) function')
    }

    let actionReducer = reducers[action.type]

    return actionReducer && actionReducer(state, action) || state
  }

  // remap selectors to namespace
  let namespacedSelectors = {}

  if (namespace) {
    for (let selectorKey in selectors) {
      let selector = selectors[selectorKey]
      selectors[selectorKey] = state => selector(state.get ? state.get(namespace) : state[namespace])
    }
  }

  return Object.assign(actions, selectors, config, { namespace, actions, reducers, reducer })
}

// merge([ map1, map2, ... ]) - maps reducers to their namespace for easy inclusion into store
export const merge = (maps = []) => maps.reduce((acc, map) => {
  let { namespace, reducer } = map
  acc[namespace] = reducer

  return acc
}, {})


export default { automap }
