import CircularText from "../assets/animations/circularText"
import RotatingText from "../assets/animations/rotatingText"
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Home() {
  return (
    <>
      <div className="max-w-screen w-full h-auto bg-zinc-900">
        <div className="h-screen w-full pt-40">
          <CircularText
            text="*CODE NIMBUS* "
            onHover="speedUp"
            spinDuration={20}
            className="custom-class w-1/4 text-green-600 "
          />



          <div className="flex sm:pl-20 p-5 flex-col items-center text-xl  justify-center gap-2">
            <div className="flex gap-3 items-center justify-center">
              <p className="font-bold text-green-400 text-4xl">Code</p>
              <RotatingText
                texts={['Creative', 'Unique', 'on Cloud', 'Everywhere', 'Nimbus']}
                mainClassName="px-2 w-50 text-4xl font-bold bg-green-400 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </div>

            <div className="text-green-400">
              <p><span className="font-bold text-green-300">Code Nimbus</span> is designed for seamless cloud coding.</p>
            </div>

          </div>


        </div>

      </div>




      <Popover  >

        <PopoverTrigger className="absolute hover:outline-2 hover:outline-offset-2 hover:outline-green-300 top-5 right-5 bg-green-700 rounded font-bold text-xl cursor-pointer text-white hover:bg-green-500 pl-7 pr-7 pt-2 pb-2">Room</PopoverTrigger>

        <PopoverContent className="cursor-pointer flex flex-col items-center w-60 justify-center gap-2">
          <p className="font-bold border-2 w-full border-white hover:border-b-zinc-400 text-center">Create room</p>
          <p className="font-bold border-2 w-full border-white hover:border-b-zinc-400 text-center">Join room</p>
        </PopoverContent>

      </Popover>

      <Link to={"/userEntry"} className="absolute hover:outline-2 hover:outline-offset-2 hover:outline-green-300 top-5 right-40 bg-green-700 rounded font-bold text-xl cursor-pointer text-white hover:bg-green-500 pl-7 pr-7 pt-2 pb-2">

        <button className="cursor-pointer">Login / Signup</button>

      </Link>
    </>
  )
}
