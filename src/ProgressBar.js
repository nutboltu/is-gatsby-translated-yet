import React from 'react'
import { css } from 'glamor'
import tinycolor from 'tinycolor2'

function getColor(amount) {
  if (amount === undefined) {
    return 'white'
  }

  if (amount < 0.5) {
    return tinycolor
      .mix(tinycolor('#f5d47b'), tinycolor('#edc24e'), amount * 100)
      .toHexString()
  }
  return tinycolor
    .mix(tinycolor('#83e88d'), tinycolor('#13a22a'), (amount - 0.5) * 100)
    .toHexString()
}

export default function ProgressBar({ value = 0 }) {
  const percent = value * 100
  const color = getColor(value)
  const style = css({
    width: '100%',
    height: '1.25rem',
    backgroundColor: '#f5f3f3',
    border: `1px solid ${color}`,
  })

  const innerStyle = css({
    height: '100%',
    transition: 'all 0.35s ease-in',
  })
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      {...style}
    >
      <div
        {...innerStyle}
        style={{
          width: `${percent}%`,
          backgroundColor: color,
        }}
      />
    </div>
  )
}
