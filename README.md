# WebSocket Chat

This is a PoC of chat based on WebSockets.

The repository consists of both frontend and backend. Both folders have their own readme files
([backend](backend/README.md) and [frontend](frontend/README.md)). Refer to them for more details on each part of the
app.

## Docker

Both apps have `Dockerfile` and they can be deployed as a Docker container.

The root folder also contains `docker-compose.yml` which may be used for deploying those containers as a stack.

## Runtime transport layer safety using `io-ts`

The app utilizes [io-ts](https://github.com/gcanti/io-ts) package for runtime safety. Using the library allows
enforcing types during serialization/deserialization. This leads to more robust communication between backend and
frontend.

## Prettier and ESLint

Both apps use [prettier](https://prettier.io/) and [ESLint](https://typescript-eslint.io/) for code style consistency.
They are run during the Docker container build.

## Bugs and potential enhancements

### Abstract transport layer to a separate package

There is quite a lot of duplicated code, especially in transport layers. This leads to the maintenance overhead and
general complexity. This can be solved by abstracting the transport layer logic to a separate package and reusing it
on both backend and frontend. This way, changes on both frontend and backend will be consistent.

### Minor bugs

There are couple UX related bugs fixing, which might take some time, and they were intentionally ignored.

For example, if the chat has many loaded messages, the scroll appears. On macOS this scroll is hidden until a user
scrolls the container. However, on Windows machines, this scroll is always shown and should be hidden while the user
does not use the scroll.

### Cover with unit tests

Currently, there are no unit tests in the project at all. This should be fixed as soon as possible as well.

### Data persistence

Login info, connection states and messages are not persisted at the moment. Normally, persisting those would be a great
idea. This is out of the scope of this project for now.