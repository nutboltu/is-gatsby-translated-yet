import React, { useEffect, useState, useMemo } from 'react'
import { css } from 'glamor'
import sortBy from 'lodash/sortBy'
import fromPairs from 'lodash/fromPairs'
import graphql from '@octokit/graphql'
import LangProgress from './LangCard'
import SortSelector from './SortSelector'

function getLangProgress(lang, issue) {
  const {
    corePages = 'Core Pages',
    ...langProps
  } = lang
  const { body, createdAt, lastEditedAt = createdAt, ...issueProps } = issue
  const sections = {}
  body.split(/^##\s+/gm).forEach(section => {
    const [heading, ...content] = section.split('\n')
    const items = content.filter(line => {
      return /(\*|-) *\[[ x]\]/.test(line)
    })

    const finishedItems = items.filter(line => /(\*|-) \[x\]/.test(line))
    sections[heading.trim()] = finishedItems.length / items.length
  })

  return {
    ...langProps,
    ...issueProps,
    createdAt,
    lastEditedAt,
    coreCompletion: sections[corePages],
  }
}

async function getProgressList(langs) {
  // TODO this search requires looking for issues with the string "Translation Progress"
  // in the title. Maybe we should replace it with something more robust.
  const { search } = await graphql(
    `
      query($limit: Int!) {
        search(
          type: ISSUE
          query: "org:gatsbyjs Translation Progress in:title community/code-of-conduct in:body"
          first: $limit
        ) {
          nodes {
            ... on Issue {
              title
              body
              closed
              createdAt
              lastEditedAt
              number
              repository {
                name
              }
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token ${process.env.REACT_APP_GATSBY_GITHUB_AUTH_TOKEN}`,
      },
      limit: langs.length + 5, // padding in case of extra issues
    },
  )

  const issuesMap = fromPairs(
    search.nodes
      .filter(issue => !!issue && issue.repository)
      .map(issue => [issue.repository.name, issue]),
  )

  return langs.map(lang => getLangProgress(lang, issuesMap[`gatsby-${lang.code}`]));
}

const sortOptions = [
  { key: 'code', label: 'Lang Code' },
  { key: 'enName', label: 'English Name' },
  { key: ['coreCompletion'], label: 'Completion' },
  { key: 'createdAt', label: 'Start Date' },
  { key: 'lastEditedAt', label: 'Last Updated' },
]

export default function LangList({ langs }) {
  const [progressList, setProgressList] = useState(langs)
  const [sortKey, setSortKey] = useState('code')
  useEffect(() => {
    getProgressList(langs).then(setProgressList)
  }, [langs])
  const style = css({
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  })

  const sortedList = useMemo(() => {
    const sorted = sortBy(progressList, sortKey)
    if (
      (Array.isArray(sortKey) && sortKey.includes('coreCompletion')) ||
      sortKey === 'lastEditedAt'
    ) {
      sorted.reverse()
    }
    return sorted
  }, [progressList, sortKey])
  
  return (
    <div>
      <SortSelector
        options={sortOptions}
        value={sortKey}
        onSelect={setSortKey}
      />
      <div {...style}>
        {sortedList.map(lang => (
          <LangProgress key={lang.code} {...lang} />
        ))}
      </div>
    </div>
  )
}
