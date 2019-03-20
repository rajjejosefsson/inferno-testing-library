import 'jest-dom/extend-expect'
import {render, cleanup} from '../'

import {Component, createRef, createPortal} from 'inferno'

afterEach(cleanup)

test('renders div into document', () => {
  const ref = createRef()
  const {container} = render(<div ref={ref} />)
  expect(container.firstChild).toBe(ref.current)
})

test('works great with inferno portals', () => {
  class MyPortal extends Component {
    constructor(...args) {
      super(...args)
      this.portalNode = document.createElement('div')
      this.portalNode.dataset.testid = 'my-portal'
    }
    componentDidMount() {
      document.body.appendChild(this.portalNode)
    }
    componentWillUnmount() {
      this.portalNode.parentNode.removeChild(this.portalNode)
    }
    render() {
      return createPortal(
        <Greet greeting="Hello" subject="World" />,
        this.portalNode,
      )
    }
  }

  function Greet({greeting, subject}) {
    return (
      <div>
        <strong>
          {greeting} {subject}
        </strong>
      </div>
    )
  }

  const {unmount, getByTestId, getByText} = render(<MyPortal />)
  expect(getByText('Hello World')).toBeInTheDocument()
  const portalNode = getByTestId('my-portal')
  expect(portalNode).toBeInTheDocument()
  unmount()

  // TODO: why timeout needed
  setTimeout(() => {
    expect(portalNode).not.toBeInTheDocument()
  }, 300)
})

test('returns baseElement which defaults to document.body', () => {
  const {baseElement} = render(<div />)
  expect(baseElement).toBe(document.body)
})

it('cleansup document', () => {
  const spy = jest.fn()

  class Test extends Component {
    componentWillUnmount() {
      spy()
    }

    render() {
      return <div />
    }
  }

  render(<Test />)
  cleanup()

  // TODO:
  setTimeout(() => {
    expect(document.body.innerHTML).toBe('')
    expect(spy).toHaveBeenCalledTimes(1)
  }, 300)
})

it('supports fragments', () => {
  class Test extends Component {
    render() {
      return (
        <div>
          <code>DocumentFragment</code> is pretty cool!
        </div>
      )
    }
  }

  const {asFragment} = render(<Test />)
  expect(asFragment()).toMatchSnapshot()
  cleanup()

  // TODO:
  setTimeout(() => {
    expect(document.body.innerHTML).toBe('')
  }, 300)
})

test('renders options.wrapper around node', () => {
  const WrapperComponent = ({children}) => (
    <div data-testid="wrapper">{children}</div>
  )

  const {container, getByTestId} = render(<div data-testid="inner" />, {
    wrapper: WrapperComponent,
  })

  expect(getByTestId('wrapper')).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(`
<div
  data-testid="wrapper"
>
  <div
    data-testid="inner"
  />
</div>
`)
})
