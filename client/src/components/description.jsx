import React from 'react'
import ScrollFloat from '../assets/animations/floatingText'

export default function Description() {
  return (
    <>
      <div className="bg-zinc-900 text-green-600 flex w-full font-bold  justify-center">
        <ScrollFloat
  animationDuration={1}
  ease='back.inOut(2)'
  scrollStart='center bottom+=50%'
  scrollEnd='bottom bottom-=40%'
        stagger={0.03}
       
>
  Code Nimbus
</ScrollFloat>
      </div>
      <div className='bg-zinc-900 text-green-400 w-full max-w-screen p-10'>
       <span className='text-green-300 font-bold text-2xl'> Code Nimbus</span> is a next-generation Cloud IDE designed to offer developers a seamless, flexible, and powerful coding experience entirely in the browser. Inspired by the challenges faced in remote development, collaboration, and environment setup, Codenimus aims to eliminate the barriers of traditional local development by providing isolated per-user Docker containers, real-time collaborative editing, integrated terminal access, and direct GitHub integration. Whether you're a student learning to code, a freelancer building projects, or part of a remote team collaborating across time zones, Codenimus empowers you to code, debug, and deploy effortlessly without ever leaving your browser. With features like ephemeral whiteboard rooms for quick sessions and persistent user environments for long-term work, it blends the simplicity of tools like Replit with the power of professional IDEs. Codenimus stands as a meaningful innovation in the cloud development space, making scalable, accessible, and collaborative programming a reality for everyone.
      </div>
    </>
  )
}
