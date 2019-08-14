#! /usr/bin/env node

const fs = require('fs')
const path = require('path')

module.exports = buildConfig = build => {
  let config = {}
  if (build.data.environment.toUpperCase() === 'PRODUCTION') {
    config = {
      ENV: 'production',
      API_ACCOUNTS: 'https://accounts.api.zesty.io/v1',
      API_INSTANCE: '.api.zesty.io/v1/',
      API_AUTH: 'https://svc.zesty.io/auth',
      MANAGER_URL: '.manage.zesty.io',
      MANAGER_URL_PROTOCOL: 'https://',
      PREVIEW_URL: '-dev.preview.zestyio.com',
      PREVIEW_URL_PROTOCOL: 'https://',
      COOKIE_NAME: 'APP_SID',
      COOKIE_DOMAIN: '.zesty.io',
      EMAIL_SERVICE: 'https://email.zesty.io/send',
      C_NAME: 'sites2.zesty.zone',
      A_RECORD: '130.211.21.25'
    }
  } else if (build.data.environment.toUpperCase() === 'STAGE') {
    config = {
      API_ACCOUNTS: 'https://accounts.stage-api.zesty.io/v1',
      API_INSTANCE: '.stage-api.zesty.io/v1/',
      API_AUTH: 'https://stage-svc.zesty.io/auth',
      MANAGER_URL: '.stage-manage.zesty.io',
      MANAGER_URL_PROTOCOL: 'https://',
      PREVIEW_URL: '-dev.stage-preview.zestyio.com',
      PREVIEW_URL_PROTOCOL: 'https://',
      COOKIE_NAME: 'STAGE_APP_SID',
      COOKIE_DOMAIN: '.zesty.io',
      EMAIL_SERVICE: 'https://email.zesty.io/send',
      C_NAME: 'sites2.zesty.zone',
      A_RECORD: '130.211.21.25'
    }
  } else {
    config = {
      API_ACCOUNTS: 'http://accounts.api.zesty.localdev:3022/v1',
      API_INSTANCE: '.api.zesty.localdev:3023/v1/',
      API_AUTH: 'http://svc.zesty.localdev:3011/auth',
      MANAGER_URL: '.manage.zesty.localdev:3020',
      MANAGER_URL_PROTOCOL: 'http://',
      PREVIEW_URL: '-dev.preview.zestyio.localdev:3020',
      PREVIEW_URL_PROTOCOL: 'http://',
      COOKIE_NAME: 'DEV_APP_SID',
      COOKIE_DOMAIN: '.zesty.localdev',
      C_NAME: 'sites2.zesty.zone',
      A_RECORD: '130.211.21.25'
    }
  }

  fs.writeFileSync(
    path.resolve(process.cwd(), `build/config.${build.data.gitCommit}.js`),
    `window.CONFIG = ${JSON.stringify(config)}`
  )

  return config
}
