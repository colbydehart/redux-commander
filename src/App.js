import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetch } from './index.js'
import './App.css'

class App extends Component {
  componentDidMount = () => {
    this.props.dispatch(fetch())
  }

  render() {
    const { fetching, recipes } = this.props
    return (
      <div className="App">
        <h1>Recipes</h1>
        {fetching && <p>loading...</p>}
        <ul>
          {recipes && recipes.map(r => (
            <li key={r.name}>{ r.name }</li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapState = state => ({
  fetching: state.fetching,
  recipes: state.recipes
})

export default connect(mapState)(App)
