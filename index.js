import { h, app } from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {Landing} from './landing'
import * as firebase from 'firebase'
const state = {
    location: location.state
  }
  
  const actions = {
    location: location.actions
  }
  const LandingView =  Landing
  const AuthedView = () => <h2>Authed</h2>


  const view = state => (
    <div>
      <ul>
        <li>
          <Link to="/">LandingView</Link>
        </li>
        <li>
          <Link to="/about">AuthedView</Link>
        </li>
      </ul>
  
      <hr />
  
      <Route path="/" render={LandingView} />
      <Route path="/about" render={AuthedView} />
    </div>
  )

  const main = app(
    state,
    actions,
     view,
    document.body
  )

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyBh14oSjNmTn7dpxc4dbAsf7lEjif9Xk0M",
    authDomain: "my-mud-4b575.firebaseapp.com",
    databaseURL: "https://my-mud-4b575.firebaseio.com",
    projectId: "my-mud-4b575",
    storageBucket: "my-mud-4b575.appspot.com",
    messagingSenderId: "105235496062"
  };
  firebase.initializeApp(config);


  const unsubscribe = location.subscribe(main.location)