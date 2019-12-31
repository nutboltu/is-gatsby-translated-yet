import React, { forwardRef } from 'react'
import { css } from 'glamor'

export default forwardRef(function ExtLink(
  { style: customStyle, href, children, ...props },
  ref,
) {
  const style = css({
    color: '#8c2dba',
    textDecoration: 'none',

    ':hover': {
      textDecoration: 'underline',
    },
    ...customStyle,
  })
  return (
    <a
      {...props}
      {...style}
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
})
