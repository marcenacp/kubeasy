# kubeasy

[![Build Status](https://travis-ci.org/marcenacp/kubeasy.svg?branch=master)](https://travis-ci.org/marcenacp/kubeasy)

## Installation

- Install `kubeasy` by downloading the latest version from Github
```bash
git clone https://github.com/marcenacp/kubeasy.git
cd easy-docker/
npm install
npm link
```

- Use it with the command: `kubeasy`

## Development

#### Development pattern

Help me develop `kubeasy`!
I used development patterns that are very similar to react-redux.

**Hooks** (in `src/hooks`) get data from Kubernetes using `kubectl`.
They are equivalent of sagas in Redux.

**Reducers** (in `src/reducers`) handle data and store it in the state.
They are equivalent of reducers in Redux.

**Widgets** (in `src/widgets`) watch inputs from user and render the command-line interface according to the state.
They are equivalent of components in React.

#### Useful commands

- `npm run dev`: launch application with [nodemon](https://github.com/remy/nodemon)
- `npm run test`: check syntax in Javascript files using [prettier](https://github.com/prettier/prettier) (run in CI)
