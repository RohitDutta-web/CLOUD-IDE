import React from 'react'
import CardSwap, { Card } from '../assets/animations/card'

export default function Features() {
  return (
    <>
      <div style={{ height: '350px', position: 'relative', width: "50%" }} >
        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          delay={5000}
          pauseOnHover={false}
        >
          <Card className="bg-zinc-900 text-green-400 flex flex-col items-center ">
            <h3>Individual Instance</h3>
            <p>Your content here</p>
          </Card>
          <Card className="bg-zinc-900 text-green-400 flex flex-col items-center ">
            <h3>Card 2</h3>
            <p>Your content here</p>
          </Card>
          <Card className="bg-zinc-900 text-green-400 flex flex-col items-center ">
            <h3>Card 3</h3>
            <p>Your content here</p>
          </Card>
        </CardSwap>
      </div>
    </>
  )
}
