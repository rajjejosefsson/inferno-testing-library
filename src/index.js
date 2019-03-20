import {getQueriesForElement, prettyDOM} from 'dom-testing-library'
import {render as renderWithInferno} from 'inferno'
import {createElement} from 'inferno-create-element'

const mountedContainers = new Set()

function render(
  ui,
  {container, baseElement = container, queries, wrapper: WrapperComponent} = {},
) {
  if (!container) {
    // default to document.body instead of documentElement to avoid output of potentially-large
    // head elements (such as JSS style blocks) in debug output
    baseElement = document.body
    container = document.body.appendChild(document.createElement('div'))
  }

  // we'll add it to the mounted containers regardless of whether it's actually
  // added to document.body so the cleanup method works regardless of whether
  // they're passing us a custom container or not.
  mountedContainers.add(container)

  const wrapUiIfNeeded = innerElement =>
    WrapperComponent
      ? createElement(WrapperComponent, null, innerElement)
      : innerElement

  renderWithInferno(wrapUiIfNeeded(ui), container)

  return {
    container,
    baseElement,
    // eslint-disable-next-line no-console
    debug: (el = baseElement) => console.log(prettyDOM(el)),
    unmount: () => renderWithInferno(null, container.$V),
    rerender: rerenderUi => {
      render(wrapUiIfNeeded(rerenderUi), {container, baseElement})
      // Intentionally do not return anything to avoid unnecessarily complicating the API.
      // folks can use all the same utilities we return in the first place that are bound to the container
    },
    asFragment: () => {
      /* istanbul ignore if (jsdom limitation) */
      if (typeof document.createRange === 'function') {
        return document
          .createRange()
          .createContextualFragment(container.innerHTML)
      }

      const template = document.createElement('template')
      template.innerHTML = container.innerHTML
      return template.content
    },
    ...getQueriesForElement(baseElement, queries),
  }
}

function cleanup() {
  mountedContainers.forEach(cleanupAtContainer)
}

// maybe one day we'll expose this (perhaps even as a utility returned by render).
// but let's wait until someone asks for it.
function cleanupAtContainer(container) {
  if (container.parentNode === document.body) {
    document.body.removeChild(container)
  }

  renderWithInferno(null, container.$V)
  mountedContainers.delete(container)
}

// just re-export everything from dom-testing-library
export * from 'dom-testing-library'
export {render, cleanup}

/* eslint func-name-matching:0 */
