import { success, done } from './index.js'

const recipes = [
  {name: 'pizza'},
  {name: 'pasta'},
  {name: 'sandwich'}
]

const moreRecipes = [
  {name: 'rice'},
  {name: 'quinoa'},
  {name: 'lasagna'},
  {name: 'soup'},
  {name: 'salad'}
]

export const fetchRecipes = () => {
  return new Promise(resolve => {
    setTimeout(
      () => resolve(success(recipes)),
      1500
    )
  })
}

export const fetchXMore = x => {
  return new Promise(resolve => {
    setTimeout(
      () => resolve(done(moreRecipes.slice(0, x))),
      3000
    )
  })
}
