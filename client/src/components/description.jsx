import React from 'react'
import ScrollFloat from '../assets/animations/floatingText'

export default function Description() {
  return (
    <>
      <ScrollFloat
  animationDuration={1}
  ease='back.inOut(2)'
  scrollStart='center bottom+=50%'
  scrollEnd='bottom bottom-=40%'
        stagger={0.03}
       
>
  reactbits
</ScrollFloat>
    </>
  )
}
