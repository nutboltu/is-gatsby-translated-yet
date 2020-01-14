import React from 'react'
import { css } from 'glamor'
import ExtLink from './ExtLink'

const style = css({
  height: '30px',
  borderRadius: '50%',
  border: '1px solid #ddd',
  marginRight: '5px',
})

const containerStyle = css({
  padding: '10px 0',
})

export default function Maintainers({
  maintainers,
}) {
  return (
    <>
      <p {...css({ color: 'DimGrey', fontSize: '.75rem', marginTop: '5px' })}>
          Maintainers
      </p>
      <div {...containerStyle} >
        
        {
          maintainers.map((maintainer, index) => (
            <ExtLink href={`https://github.com/${maintainer}`} key={index}>
              <img {...style} src={`https://github.com/${maintainer}.png`} alt={maintainer} />
            </ExtLink>
          ))
        }
      </div>
    </>
  )
}