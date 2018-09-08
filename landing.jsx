import { h } from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

export const Landing = (state, actions) => {

    return(
        <div>
            <h2>landing</h2>
            <button onClick={() => actions.login()}>Google</button>
        </div>
    );
}

// export const GoogleLoginButton = (state, actions) => 