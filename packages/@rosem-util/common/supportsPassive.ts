import inBrowser from '@rosem-util/env/inBrowser'

let supportsPassive: boolean = false

if (inBrowser) {
  try {
    const opts: any = {}
    Object.defineProperty(opts, 'passive', {
      get() {
        /* istanbul ignore next */
        supportsPassive = true
      },
    })
    window.addEventListener('test-passive', function() {}, opts)
  } catch (e) {}
}

export default supportsPassive