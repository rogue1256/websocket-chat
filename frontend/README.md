# Frontend

This is an implementation of a chat based on WebSockets.

The project uses the following libraries:

- The latest stable version of [React (18)](https://reactjs.org/)
- [MUI](https://mui.com/core/) as a components framework
- [Native JS WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) for websocket communications
- [MobX](https://mobx.js.org/README.html) for state management
- [React Hook Form](https://react-hook-form.com/) for form handling
- [yup](https://github.com/jquense/yup) for validation
- [io-ts](https://github.com/gcanti/io-ts) for runtime model validation

The app supports initiating a websocket connection, logging in with a username, storing secret for a re-login
(does not persist after the page refresh), reconnecting after a connection loss, message exchanging.

## The flow

A user is presented with a login form with a username, and a server address. The user has to provide a valid URL in
the correct format. Otherwise, the validation is triggered. After user logs in, they can write messages and receive
messages from other chat participants.

If the server crashes/connection is lost/slow connection, the app starts infinite attempts to reconnect to the server
provided. This can be canceled by the user by clicking "disconnect" button in the top right corner. The reconnection
part may be improved by using [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff)

If the user disconnects from the chat, the app remembers the last username + password combination and automatically
fills in those in the login form.

The application supports different screen sizes, including mobile ones. The latter ones are not fine-tuned, so they
might feel a bit clunky.

## The `ChatWebsocket` wrapper

This is the wrapper over the [native JS WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). It adds
a fixed timeout for initiating a connection, as well as additional abstraction for ease of use.

## The transport layer

All serializable communications are additionally verified in runtime using [io-ts](https://github.com/gcanti/io-ts).
Refer to the documentation of the library for more details.

Generally, the idea is to make the app resilient to incorrect string serializations. There is a "fallback-style"
protection, which would throw an error for developer if something cannot be properly deserialized. This might break
some user interactions, and there is a better way to handle such things. However, this would imply adding a layer of
logging/message reporting, which might add up to quite a lot of efforts.

## ESLint and prettier

The app uses [ESLint](https://typescript-eslint.io/) and [Prettier](https://prettier.io/) to enforce consistent code
style and catch common programming errors.

## Error handling

Currently, error handling is done by utilizing `throw new Error()`. This is not user-friendly. I would say that some
logging with unique IDs is a way to go. But this would imply integrating with some logging provider, which is out of
the scope of this project.