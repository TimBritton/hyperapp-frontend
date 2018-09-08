import { h, app } from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

import {Landing} from './landing'
import * as firebase from 'firebase'
const state = {
    location: location.state,
    user: location.user
  }
  
  const actions = {
    location: location.actions,
    login: state => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            actions.setUser(user)
            
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    },
    setUser: value => state => {{ user: value }}

  }
  const LandingView =  Landing(state)
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