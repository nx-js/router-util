'use strict'

module.exports = {
  toQuery,
  toParams,
  toPath,
  toRoute,
  toAbsolute
}

function toQuery (params) {
  const query = []
  for (let key in params) {
    const param = params[key]
    if (param !== undefined) {
      query.push(`${key}=${param}`)
    }
  }
  return query.length ? ('?' + query.join('&')) : ''
}

function toParams (query) {
  if (query[0] === '?') {
    query = query.slice(1)
  }
  query = query.split('&')

  const params = {}
  for (let keyValue of query) {
    keyValue = keyValue.split('=')
    if (keyValue.length === 2) {
      params[keyValue[0]] = keyValue[1]
    }
  }
  return params
}

function toPath (route) {
  return '/' + normalizeRoute(route).join('/')
}

function toRoute (path) {
  return normalizeRoute(path.split('/'))
}

function toAbsolute (route, level) {
  if (route[0] === '.' || route[0] === '..') {
    if (route[0] === '.') {
      route.shift()  
    }
    let depth = 0
    while (route[0] === '..') {
      route.shift()
      depth++
    }
    return history.state.route.slice(0, level - depth).concat(route)
  }
  return route
}

function normalizeRoute (route) {
  const result = []
  let parentOver, selfOver = false

  for (let token of route) {
    if (token === '..') {
      if (parentOver) {
        result.pop()
      } else {
        result.push(token)
      }
    } else if (token === '.' && !selfOver) {
      result.push(token)
    } else if (token !== '') {
      result.push(token)
    }
    selfOver = true
  }
  return result
}
