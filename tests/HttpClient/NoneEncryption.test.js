
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import WebHttp from '../../src/index.mjs'
import CONTEXT_MAP from '../../src/CONSTANTS/CONTEXT_MAP.mjs'

global.window = { crypto }

let webHttp, response
const reqBody = { req: 'req' }
const expectedResponse = { resData: { resData: 'resData' }, reqData: { req: 'req' } }

async function makeHanshakeCall() {
  const options = { apiPath: 'AUTHENTICATION.HANDSHAKE.GET' }
  const response = await webHttp.request(options)
  const { data: respBody } = response
  const { data } = respBody
  const { publicKey } = data
  webHttp.context.set(CONTEXT_MAP.PUBLIC_KEY, publicKey)
}
async function makeServiceCall() {
  const options = { apiPath: 'API_CRYPTO_SAMPLE.SERVICE.POST', data: reqBody }
  response = await webHttp.request(options)
}

beforeAll(async () => {
  const API_ROUTES = {
    _BASE: 'http://localhost:8080',
    AUTHENTICATION: {
      HANDSHAKE: {
        GET: '/handshake'
      }
    },
    API_CRYPTO_SAMPLE: {
      SERVICE: {
        POST: '/api-crypto-sample/service'
      }
    }
  }
  const ENABLE_CRPTOGRAPHY = false
  const API_KEY = 'API_KEY'
  const CONFIG = { API_ROUTES, ENABLE_CRPTOGRAPHY, API_KEY }
  webHttp = new WebHttp(CONFIG)
  await makeHanshakeCall()
  await makeServiceCall()
})

describe('Run WebHttp Test (Both Encryption Disabled)', () => {
  test('Post Service Call to return 200 status', async () => {
    const { status } = response
    expect(status).toBe(200)
  })

  test('Post Service Call to return 200 statusCode', async () => {
    const { data: resBody } = response
    const { statusCode } = resBody
    expect(statusCode).toBe(200)
  })

  test('Post Service Call to return Expected response Data', async () => {
    const { data: resBody } = response
    const { data } = resBody
    expect(data).toMatchObject(expectedResponse)
  })
})
