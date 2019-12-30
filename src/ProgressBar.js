import React from 'react'
import { css } from 'glamor'
import tinycolor from 'tinycolor2'

function getColor(amount) {
  const medColor = '#FFE380'
  if (amount === undefined) {
    return 'white'
  }

  if (amount < 0.5) {
    return tinycolor
      .mix(tinycolor('#FF8F73'), tinycolor(medColor), amount * 100)
      .toHexString()
  }
  return tinycolor
    .mix(tinycolor(medColor), tinycolor('#4FA246'), (amount - 0.5) * 100)
    .toHexString()
}

export default function ProgressBar({ value = 0 }) {
  const percent = value * 100
  const style = css({
    width: '100%',
    height: '1.25rem',
    backgroundColor: 'lightgray',
    border: '1px solid gray',
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
          backgroundColor: getColor(value),
        }}
      />
    </div>
  )
}
