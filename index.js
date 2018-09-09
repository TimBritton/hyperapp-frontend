import { h, app } from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"
import { Landing } from './landing'
import { Terminal } from './terminal'
import { Header } from './heading'
import * as firebase from 'firebase'
import EventBus from 'vertx3-eventbus-client'
var eb = new EventBus('http://localhost:8080/game', null);
const state = {
  location: location.state,
  user: location.user,
  messages: new Array(),
  eventbus: eb
}

const actions = {
  location: location.actions,
  login: () => (state, actions) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(state)
      actions.setUser(user)
      console.log(state)

      // ...
    }).catch(function (error) {
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
  setUser: value => state => {
    return { user: value }
  },
  handleSomeMessage: (error, message) => state => {
    if (message != null)
      return { messages: state.messages.push(message) }
    else {
      console.log(error)
      return state
    }
  },
  setPlayer: value => state => {
    return { player: value }
  },

}
const LandingView = Landing(state, actions)
const AuthedView = (state, actions) => (props, children) => {

  if (state.user == null) {
    return <Redirect to={"/"} />
  }

  return (
    <Terminal state={state} actions={actions}/>
  );
}

const view = (state, actions) => (
  <div>
    <Header />
    <Route path="/" render={Landing(state, actions)} />
    <Route path="/about" render={AuthedView(state, actions)} />
    <hr />
    <p>
      <pre>{JSON.stringify(state)}</pre>
    </p>
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
