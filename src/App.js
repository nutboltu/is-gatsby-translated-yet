import React from 'react'
import { css } from 'glamor'
import ExtLink from './ExtLink'
import LangList from './LangList'
import langs from './langs'

function Title() {
  const style = css({
    fontSize: '2.5rem',
    fontWeight: 'normal',
    marginBottom: '2rem',
  })
  return (
    <h1 {...style}>
      <img src="/gatsby-logo.png" alt="gatsby-icon" height="50" width="50" />
      {` `} Is Gatsby Translated Yet?
    </h1>
  )
}

function Description() {
  const style = css({
    fontSize: '1.5rem',
    marginBottom: '2rem',
  })

  return (
    <>
      <p {...style}>
          There is an ongoing effort to translate the content on {' '}
        <ExtLink href="https://www.gatsbyjs.org/">gatsbyjs.org</ExtLink>
        {` `} into multiple languages.
        
      </p>
      <p {...style}>
       <ExtLink href="https://www.gatsbyjs.org/">gatsbyjs.org</ExtLink>
        {` `} site is currently translating in {` `}
        <strong {...css({ fontWeight: 600 })}>{langs.length}</strong> languages. 🎉
      </p>
    </>
  )
}

function Footer() {
  const style = css({
    marginTop: '2rem',
    marginBottom: '2rem',
    fontSize: '1.5rem',
    lineHeight: 2,
  })
  return (
    <footer {...style}>
      <p>
        If your language is not listed above, check the list of {` `}
        <ExtLink href="https://github.com/gatsbyjs/gatsby/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+%22New+Translation+Request%22">open translation requests.</ExtLink>
      </p>
      <p>
        If you don’t see the language among the issues listed, feel free to create a {` `}
        <ExtLink href="https://github.com/gatsbyjs/gatsby/issues/new?template=new_translation.md">translation request issue</ExtLink>
        {` `} for it and follow the instructions.
      </p>
      <p> For more details visit {` `}
        <ExtLink href="https://www.gatsbyjs.org/contributing/gatsby-docs-translation-guide/">translation guide.</ExtLink>
      </p>
    </footer>
  )
}

export default function App() {
  const style = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem 4rem',
    width: '100vw',
    backgroundColor: 'whitesmoke',

    '@media (max-width: 48rem)': {
      padding: '2rem 2rem',
    },
  })
  return (
    <div {...style}>
      <Title />
      <Description />
      <LangList langs={langs} />
      <Footer />
    </div>
  )
}
