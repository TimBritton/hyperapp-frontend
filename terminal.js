import { h } from 'hyperapp'

export const Terminal = (state, actions) => (props, children) => {

    console.log(state.state)

    // state.state.eventbus.onopen = () => {
        state.state.eventbus.registerHandler('some-address', function (error, message) {
            console.log('received a message: ' + JSON.stringify(message));
        });
    // }

    return (
        <div class="container text-center" style="height: 100%">
            <div class="container text-center">
                <MessageList />
            </div>
            <div class="fixed-bottom">
                <input class="form-control" type="text" />
            </div>
        </div>
    );
}

export const MessageList = (state, actions) => (
    state.messages && state.messages.map(message => <div><pre>{message}</pre></div>)
)
