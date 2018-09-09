import { h } from 'hyperapp'
import { Link, Route, Switch, Redirect, location } from "@hyperapp/router"

export const Landing = (state, actions) => (props, children) => {

    console.log(actions)
    console.log(state)
    if (state.user != null) {
        return <Redirect to={"/about"} />
    }

    return (
        <div class="text-center">
            <div class="container">
                <h2 class="display-4">Welcome</h2>
                <p>Hello before you can continue you must sign in!</p>
                <div class="btn-group">
                    <button className="btn btn-outline-primary" onclick={actions.login}>Google</button>
                    <button className="btn btn-outline-primary" onclick={actions.login}>Google</button>
                    <button className="btn btn-outline-primary" onclick={actions.login}>Google</button>
                </div>
            </div>
        </div>
    );
}

// export const GoogleLoginButton = (state, actions) => 