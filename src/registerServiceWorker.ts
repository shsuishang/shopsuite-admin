/* eslint-disable no-console */
import { register } from 'register-service-worker'
import { gp } from '@gp'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
      gp.$pub('ms-update')

      //如果是演示环境，更新后移除主题，用不到可删除
      if (
        location.hostname === 'shopsuite.cn' ||
        location.hostname === 'shopsuite.cn'
      )
        localStorage.removeItem('theme')
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
