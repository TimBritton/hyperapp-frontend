import { h } from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

export const Landing = (state, actions) =>  (props, children) =>{

    console.log(actions)
    console.log(state)
    if(state.user != null)
    {
        return <Redirect  to={"/about"} />
    }

    return(
        <div>
            <h2>landing</h2>
            <button onclick={actions.login}>Google</button>
        </div>
    );
}

// export const GoogleLoginButton = (state, actions) => 