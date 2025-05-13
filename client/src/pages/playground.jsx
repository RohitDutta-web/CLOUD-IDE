import Hamburger from 'hamburger-react'
import { useState } from 'react'

export default function Playground() {
  const [isOpen, setOpen] = useState(false)
  return (
    <>
      <div className="w-screen h-screen bg-zinc-800">
        <div className='text-white absolute flex flex-col items-center gap-2'>
          <Hamburger toggled={isOpen} toggle={setOpen} />
          {
            isOpen ? null :
              <>
                <p className='w-9 h-9 rounded  flex justify-center items-center bg-green-600'>U1</p>
                <p className='w-9 h-9 rounded  flex justify-center items-center bg-green-600'>U1</p>
              </>
          }
        </div>


      </div>
    </>
  )
}
