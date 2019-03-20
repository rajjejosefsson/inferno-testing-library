// this is where we'll put bug reproductions/regressions
// to make sure we never see them again

import {render, cleanup} from '../'

test('cleanup does not error when an element is not a child', () => {
  render(<div />, {container: document.createElement('div')})
  cleanup()
})
