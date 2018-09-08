import { h, app } from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

const state = {
    location: location.state
  }
  
  const actions = {
    location: location.actions
  }
  const Home = () => <h2>Home</h2>
  const About = () => <h2>About</h2>


  const view = state => (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
  
      <hr />
  
      <Route path="/" render={Home} />
      <Route path="/about" render={About} />
    </div>
  )

  const main = app(
    state,
    actions,
     view,
    document.body
  )


  const unsubscribe = location.subscribe(main.location)