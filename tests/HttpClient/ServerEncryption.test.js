
import { expect, describe, beforeAll, test } from '@jest/globals'
import { webcrypto as crypto } from 'node:crypto'
import WebHttp from '../../src/index.mjs'
import CONTEXT_MAP from '../../src/CONSTANTS/CONTEXT_MAP.mjs'

global.window = { crypto }

let webHttp, response
const reqBody = { req: 'req' }
const expectedStatusCode = 400
const expectedCode = 'API_CRYPTO::INVALID_ENCRYPTION_KEY'
const expectedClassification = 'API_CALL_ERROR'

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
  try {
    await webHttp.request(options)
  } catch (error) {
    response = error
  }
}

beforeAll(async () => {
  const API_ROUTES = {
    _BASE: 'http://localhost:8081',
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
  const CONFIG = { API_ROUTES, ENABLE_CRPTOGRAPHY }
  webHttp = new WebHttp(CONFIG)
  await makeHanshakeCall()
  await makeServiceCall()
})

describe('Run WebHttp Test (Both Encryption Disabled)', () => {
  test(`Post Service Call to return statusCode to be ${expectedStatusCode}`, async () => {
    const { statusCode } = response
    expect(statusCode).toBe(expectedStatusCode)
  })

  test(`Post Service Call to return classification to be ${expectedClassification}`, async () => {
    const { classification } = response
    expect(classification).toBe(expectedClassification)
  })

  test(`Post Service Call to return code to ${expectedCode}`, async () => {
    const { error } = response
    const { code } = error
    expect(code).toContain(expectedCode)
  })
})
