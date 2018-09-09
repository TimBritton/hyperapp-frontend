import { h } from 'hyperapp'
export const Header = (state, actions) => (props, children) => {

    return (
        <nav>
            <div class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="navbar-brand">
                    <a  class="navbar-brand" href="/">MUD</a>
                </div>
                {/* <ul class="nav-links">
                    <li><a class="active" href="/docs/installation">Docs</a></li>
                    <li><a href="https://github.com/kylelogue/mustard-ui" target="_blank">GitHub</a></li>
                    <li><a href="/support">Support</a></li>
                </ul> */}
                {/* <a class="mobile-menu-toggle"></a>
                <ul class="mobile-menu menu">
                    <li><a href="/docs/installation">Docs</a></li>
                    <li><a href="https://github.com/kylelogue/mustard-ui" target="_blank">GitHub</a></li>
                    <li><a href="/support">Support</a></li>
                </ul> */}
            </div>
        </nav>
    );
}