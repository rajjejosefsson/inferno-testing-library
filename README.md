<div align="center">
<h1>inferno-testing-library</h1>

<a href="https://www.emojione.com/emoji/1f410">
  <img
    height="80"
    width="80"
    alt="goat"
    src="https://raw.githubusercontent.com/kentcdodds/react-testing-library/master/other/goat.png"
  />
</a>

<p>Simple and complete Inferno DOM testing utilities that encourage good testing
practices.</p>

[**Read The Docs**](https://testing-library.com/inferno) |
[Edit the docs](https://github.com/alexkrolick/testing-library-docs)

</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-71-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]
[![Join the community on Spectrum][spectrum-badge]][spectrum]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]
<!-- prettier-ignore-end -->

<div align="center">
  <a href="https://testingjavascript.com">
    <img
      width="500"
      alt="TestingJavaScript.com Learn the smart, efficient way to test any JavaScript application."
      src="https://raw.githubusercontent.com/kentcdodds/react-testing-library/master/other/testingjavascript.jpg"
    />
  </a>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The problem](#the-problem)
- [This solution](#this-solution)
- [Example](#example)
- [Installation](#installation)
- [Examples](#examples)
- [Other Solutions](#other-solutions)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The problem

You want to write maintainable tests for your Inferno components. As a part of
this goal, you want your tests to avoid including implementation details of your
components and rather focus on making your tests give you the confidence for
which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

## This solution

The `inferno-testing-library` is a very lightweight solution for testing Inferno
components. It provides light utility functions on top of `Inferno`, in a way
that encourages better testing practices. Its primary guiding principle is:

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

## Example

```javascript
// __tests__/fetch.js
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from 'inferno-testing-library'
// this adds custom jest matchers from jest-dom
import 'jest-dom/extend-expect'

// the mock lives in a __mocks__ directory
// to know more about manual mocks, access: https://jestjs.io/docs/en/manual-mocks
import axiosMock from 'axios'
import Fetch from '../fetch' // see the tests for a full implementation

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

test('Fetch makes an API call and displays the greeting when load-greeting is clicked', async () => {
  // Arrange
  axiosMock.get.mockResolvedValueOnce({data: {greeting: 'hello there'}})
  const url = '/greeting'
  const {getByText, getByTestId, container, asFragment} = render(
    <Fetch url={url} />,
  )

  // Act
  fireEvent.click(getByText(/load greeting/i))

  // Let's wait until our mocked `get` request promise resolves and
  // the component calls setState and re-renders.
  // getByTestId throws an error if it cannot find an element with the given ID
  // and waitForElement will wait until the callback doesn't throw an error
  const greetingTextNode = await waitForElement(() =>
    getByTestId('greeting-text'),
  )

  // Assert
  expect(axiosMock.get).toHaveBeenCalledTimes(1)
  expect(axiosMock.get).toHaveBeenCalledWith(url)
  expect(getByTestId('greeting-text')).toHaveTextContent('hello there')
  expect(getByTestId('ok-button')).toHaveAttribute('disabled')
  // snapshots work great with regular DOM nodes!
  expect(container.firstChild).toMatchSnapshot()
  // you can also use get a `DocumentFragment`, which is useful if you want to compare nodes across render
  expect(asFragment()).toMatchSnapshot()
})
```

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev inferno-testing-library
```

This library has `peerDependencies` listings for `inferno` and
`inferno-create-element`.

You may also be interested in installing `jest-dom` so you can use
[the custom jest matchers](https://github.com/gnapse/jest-dom#readme).

> [**Docs**](https://testing-library.com/docs/inferno-testing-library/intro)

## Examples

> We're in the process of moving examples to the
> [docs site](https://testing-library.com/docs/example-codesandbox)

You'll find runnable examples of testing with different libraries in
[the `examples` directory](https://github.com/rajjejosefsson/inferno-testing-library/blob/master/examples).
Some included are:

- [`inferno-redux`](https://github.com/rajjejosefsson/inferno-testing-library/blob/master/examples/__tests__/inferno-redux.js)
- [`inferno-router`](https://github.com/rajjejosefsson/inferno-testing-library/blob/master/examples/__tests__/inferno-router.js)
- [`inferno-context`](https://github.com/rajjejosefsson/inferno-testing-library/blob/master/examples/__tests__/inferno-context.js)

You can also find inferno-testing-library examples at
[inferno-testing-examples.com](https://inferno-testing-examples.com/jest-rtl/).

## Other Solutions

In preparing this project,
[I tweeted about it](https://twitter.com/rajjejosefsson/status/974278185540964352)
and [Sune Simonsen](https://github.com/sunesimonsen)
[took up the challenge](https://twitter.com/sunesimonsen/status/974784783908818944).
We had different ideas of what to include in the library, so I decided to create
this one instead.

## Guiding Principles

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

We try to only expose methods and utilities that encourage you to write tests
that closely resemble how your inferno components are used.

Utilities are included in this project based on the following guiding
principles:

1.  If it relates to rendering components, it deals with DOM nodes rather than
    component instances, nor should it encourage dealing with component
    instances.
2.  It should be generally useful for testing individual Inferno components or
    full Inferno applications. While this library is focused on `inferno-dom`,
    utilities could be included even if they don't directly relate to
    `inferno-dom`.
3.  Utility implementations and APIs should be simple and flexible.

At the end of the day, what we want is for this library to be pretty
light-weight, simple, and understandable.

## Contributors

All people on the main project react-testing-library

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

## LICENSE

MIT

<!--
Links:
-->

<!-- prettier-ignore-start -->

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/rajjejosefsson/inferno-testing-library.svg?style=flat-square
[build]: https://travis-ci.org/rajjejosefsson/inferno-testing-library
[coverage-badge]: https://img.shields.io/codecov/c/github/rajjejosefsson/inferno-testing-library.svg?style=flat-square
[coverage]: https://codecov.io/github/rajjejosefsson/inferno-testing-library
[version-badge]: https://img.shields.io/npm/v/inferno-testing-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/inferno-testing-library
[downloads-badge]: https://img.shields.io/npm/dm/inferno-testing-library.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/inferno-testing-library
[spectrum-badge]: https://withspectrum.github.io/badge/badge.svg
[spectrum]: https://spectrum.chat/inferno-testing-library
[license-badge]: https://img.shields.io/npm/l/inferno-testing-library.svg?style=flat-square
[license]: https://github.com/rajjejosefsson/inferno-testing-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/rajjejosefsson/inferno-testing-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/rajjejosefsson/inferno-testing-library.svg?style=social
[github-watch]: https://github.com/rajjejosefsson/inferno-testing-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/rajjejosefsson/inferno-testing-library.svg?style=social
[github-star]: https://github.com/rajjejosefsson/inferno-testing-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20react-testing-library%20by%20%40kentcdodds%20https%3A%2F%2Fgithub.com%2Fkentcdodds%2Freact-testing-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/rajjejosefsson/inferno-testing-library.svg?style=social
[emojis]: https://github.com/rajjejosefsson/all-contributors#emoji-key
[all-contributors]: https://github.com/rajjejosefsson/all-contributors
[set-immediate]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
[guiding-principle]: https://twitter.com/rajjejosefsson/status/977018512689455106
[data-testid-blog-post]: https://blog.rajjejosefsson.com/making-your-ui-tests-resilient-to-change-d37a6ee37269
[dom-testing-lib-textmatch]: https://github.com/rajjejosefsson/dom-testing-library#textmatch
[bugs]: https://github.com/rajjejosefsson/inferno-testing-library/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc
[requests]: https://github.com/rajjejosefsson/inferno-testing-library/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen
[good-first-issue]: https://github.com/rajjejosefsson/inferno-testing-library/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+
[reactiflux]: https://www.reactiflux.com/
[stackoverflow]: https://stackoverflow.com/questions/tagged/inferno-testing-library
[inferno-hooks-testing-library]: https://github.com/mpeyper/inferno-hooks-testing-library

<!-- prettier-ignore-end -->
