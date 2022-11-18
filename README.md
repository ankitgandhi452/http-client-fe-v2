# WEB HTTP

WEB HTTP is a custom http-request package for browser with in-built support for [JOSE (JWE) encryption](https://jose.readthedocs.io/en/latest/#jwe). The ready package for backed could be found at

1. [Express JS(NodeJS)](https://www.npmjs.com/package/@m92/api-crypto)

## Installation and Setup

### [ReactAppBoilerplate](https://github.com/ankitgandhi452/ReactAppBoilerplate)

If you're using [ReactAppBoilerplate](https://github.com/ankitgandhi452/ReactAppBoilerplate) as recommended, requires 4 step configuration:

1. Create Config File

```js
// src/configurations/network/HTTP_CLIENT_CONFIG.js
import API_ROUTES from './API_ROUTES'

const { REACT_APP_ENABLE_CRPTOGRAPHY = '', REACT_APP_API_KEY } = process.env

const ENABLE_CRPTOGRAPHY = REACT_APP_ENABLE_CRPTOGRAPHY.trim().toLowerCase() === 'true'

const HTTP_CLIENT_CONFIG = {
  ENABLE_CRPTOGRAPHY,
  API_KEY: REACT_APP_API_KEY,
  API_ROUTES
}

export default HTTP_CLIENT_CONFIG
```

2. Create Constants File

```js
// src/configurations/network/HTTP_CLIENT_CONSTANTS.js
const { API_TIMEOUT } = process.env

const TIMEOUT = API_TIMEOUT || 3000

const HTTP_CLIENT_CONSTANTS = {
  TIMEOUT
}

export default HTTP_CLIENT_CONSTANTS
```

3. Create HttpClient File

```js
import HttpClientClass from '@m92/http-client-fe-v2'
import HTTP_CLIENT_CONFIG from 'configurations/network/HTTP_CLIENT_CONFIG'
import HTTP_CLIENT_CONSTANTS from 'configurations/network/HTTP_CLIENT_CONSTANTS'

const HttpClient = new HttpClientClass(HTTP_CLIENT_CONFIG, HTTP_CLIENT_CONSTANTS)

export default HttpClient
```

4. Inject HttpClient in Redux Thunk

```js
// src/configurations/redux/store.js
.....
import HttpClient from '//path/to/HttpClient/File'
.....

const middlewares = [
  thunk.withExtraArgument({ HttpClient }) // Argument can be a request object used inside all calls
]
.....
```
## License

MIT
