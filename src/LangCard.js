import React, { useRef, useEffect, useState } from 'react'
import graphql from '@octokit/graphql'
import { css } from 'glamor'
import ExtLink from './ExtLink'
import ProgressBar from './ProgressBar'
import Maintainers from './Maintainers'

function Percentage({ value, size }) {
  const style = css({
    fontSize: size === 'lg' ? '2rem' : '1.5rem',
  })
  return (
    <span {...style}>
      {value !== undefined ? Math.floor(value * 100) : '??'}%
    </span>
  )
}

function Header({ name, enName, code, repoUrl, linkRef }) {
  const linkStyle = css({
    color: 'black',
    textDecoration: 'none',
  })
  return (
    <header>
      <p {...css({ fontSize: '1rem' })}>{enName}</p>
      <h2
        {...css({
          fontWeight: 'initial',
          maxHeight: '2rem',
          fontSize: '1.5rem',
        })}
      >
        <ExtLink {...linkStyle} ref={linkRef} href={repoUrl}>
          {name}
        </ExtLink>
      </h2>
    </header>
  )
}

function getMilestone(amount) {
  if (amount < 0.1) {
    return { emoji: '🌱', text: 'Just started' }
  }
  if (amount < 0.75) {
    return { emoji: '🏗', text: 'In progress' }
  }
  if (amount < 1) {
    return { emoji: '🎁', text: 'Wrapping up' }
  }
  if (amount === 1) {
    return { emoji: '🎉', text: 'Complete!' }
  }
  return { emoji: '❓', text: '???' }
}

function Progress({ coreCompletion }) {
  const style = css({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    margin: '8px 0',
  })
  const { emoji, text } = getMilestone(coreCompletion)
  return (
    <div {...style} style={{ filter: coreCompletion === undefined ? 'blur(6px)' : undefined }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: '2.5rem' }}>{emoji}</p>
        <p style={{ fontSize: '1rem', color: 'dimgrey' }}>{text}</p>
      </div>
      <div style={{ width: '8rem', fontSize: '1rem' }}>
        <p>
          Core: <Percentage size="lg" value={coreCompletion} />
        </p>
      </div>
    </div>
  )
}

function fNum(num) {
  if (num < 10) return `0${num}`
  return `${num}`
}

function formatDate(dateString) {
  if (!dateString) {
    return '??-??-????'
  }
  const date = new Date(dateString)
  return `${date.getFullYear()}-${fNum(date.getMonth() + 1)}-${fNum(
    date.getDate(),
  )}`
}

async function getCodeOwner(repoName) {
  const {repository } = await graphql(
    `query($repoName: String!) {
      repository(name: $repoName, owner: "gatsbyjs") { 
        content:object(expression: "master:CODEOWNERS") {
          ... on Blob {
            text
          }
        }
      }
    }`, {
    headers: {
      authorization: `token ${process.env.REACT_APP_GATSBY_GITHUB_AUTH_TOKEN}`,
    },
    repoName: repoName,
  });
  const regex = /@\b\w+/g;
  const owners = repository.content.text.match(regex);
  return owners.map(owner => owner.slice(1));
}

export default function LangCard({
  name = '',
  enName = '',
  code = '',
  createdAt,
  lastEditedAt,
  number,
  coreCompletion,
}) {
  const linkRef = useRef(null)
  const down = useRef(0)
  const [maintainers, setMaintainers] = useState([]);
  const repoName = `gatsby-${code}`
  const baseUrl = `https://github.com/gatsbyjs/${repoName}`
  
  useEffect(() => {
    const getMaintainers = async function () {
      const data = await getCodeOwner(repoName);
      setMaintainers(data);
    }
    getMaintainers()
  }, []);
  // Allow clicking on card component accessibly
  // Source: https://inclusive-components.design/cards/
  const handleMouseDown = () => {
    down.current = +new Date()
  }

  const handleMouseUp = e => {
    const up = +new Date()
    if (up - down.current < 200 &&
      e.target.nodeName !== 'A'  && 
      e.target.parentNode.nodeName !== 'A') {
      linkRef.current.click()
    }
  }

  const style = css({
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem',
    width: '20rem',
    height: '19rem',
    padding: '1rem',
    borderRadius: '14px',
    cursor: 'pointer',
    boxShadow: '1px 2px 5px -4px',

    ':hover': {
      boxShadow: '1px 2px 11px -5px',
    },
  })

  return (
    <div {...style} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <Header
        name={name}
        enName={enName}
        code={code}
        repoUrl={baseUrl}
        linkRef={linkRef}
      />
      <Progress
        coreCompletion={coreCompletion}
      />
      <footer
        {...css({
          margin: '.8rem 0',
          lineHeight: 1.25,
        })}
      >
        <p {...css({ color: 'DimGrey', fontSize: '.875rem' })} style={{ filter: createdAt ? undefined: 'blur(6px)'}}>
          Start date: {formatDate(createdAt)}
        </p>
        <p {...css({ color: 'DimGrey', fontSize: '.875rem' })} style={{ filter: createdAt ? undefined: 'blur(6px)'}}>
          Last updated: {formatDate(lastEditedAt)}
        </p>
      </footer>
      <ProgressBar value={coreCompletion} />
      <Maintainers maintainers={maintainers} />
    </div>
  )
}
