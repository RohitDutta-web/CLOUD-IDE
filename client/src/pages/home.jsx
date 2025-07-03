import CircularText from "../assets/animations/circularText"
import RotatingText from "../assets/animations/rotatingText"
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSelector } from "react-redux";
import Description from "../components/description";
import giphy from "../assets/giphy.gif";
import { FaLaptopHouse } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";
import { GiArchiveRegister } from "react-icons/gi";
import SpotlightCard from "../assets/animations/card";
import { IoLogoJavascript } from "react-icons/io5";
import { TbBrandCSharp } from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import { SiPython } from "react-icons/si";
import { FaGolang } from "react-icons/fa6";
import { FaRust } from "react-icons/fa";
import { FaPhp } from "react-icons/fa";
import { DiRuby } from "react-icons/di";
import { GrMysql } from "react-icons/gr";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  
  const handleJoinRoom = () => {
    if (roomId.length < 6) {
      return alert("Invalid Room id")
    }

    navigate(`/room/${roomId}`);
    toast(` joined ${roomId} `)
  }

  const roomIdForm = (e) => {
    setRoomId(e.target.value);
  }

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);



  const handleLogOut = async() => {
    try { 
      const response = await axios.get(import.meta.env.VITE_BACKEND_LOGOUT, {
        withCredentials: true,
      });
      if (response.data?.success) {
        toast(response.data?.message)
        navigate("/");
      }



    }
    catch (e) {
      console.log(e);
      
    }
  }
  return (
    <>
      <div className="max-w-screen w-full h-auto bg-zinc-900">
        <div className="h-screen w-full pt-40">
          <CircularText
            text="*CODE NIMBUS* "
            onHover="speedUp"
            spinDuration={20}
            className="custom-class w-1/4 text-green-600 relative left-[5%]"
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
        <div className="relative bg-transparent bottom-60 flex w-full justify-center ">
          <img src={giphy} alt="" className="w-[70%] bg-green-400 p-10 rounded-2xl" />
        </div>

      </div>





      <Popover  >

        <PopoverTrigger className="absolute hover:outline-2 hover:outline-offset-2 hover:outline-green-300 top-5 right-5 bg-green-700 rounded font-bold text-xl cursor-pointer text-white hover:bg-green-500 pl-7 pr-7 pt-2 pb-2 flex items-center justify-center gap-2"> <FaLaptopHouse /> Room </PopoverTrigger>

        <PopoverContent className="cursor-pointer flex flex-col items-center w-60 justify-center gap-2">
          <p className="font-bold border-2 w-full border-white hover:border-b-zinc-400 text-center">Create room</p>
          <AlertDialog>
              <AlertDialogTrigger className="font-bold border-2 w-full cursor-pointer border-white hover:border-b-zinc-400 text-center">Join Room</AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-none shadow-md shadow-green-400">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-green-400">Enter room id</AlertDialogTitle>
                  <AlertDialogDescription className="text-green-700">
                   <input type="text" className="bg-zinc-600 w-[70%] focus:outline-offset-2 focus:outline-green-400 p-2 rounded text-white"  onChange={roomIdForm}  />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-400 text-white cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-green-600 cursor-pointer hover:bg-green-400" onClick={handleJoinRoom }>Join</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </PopoverContent>

      </Popover>

      {
        isLoggedIn ? <Popover >
          <PopoverTrigger className="absolute text-green-400  top-5 right-40  rounded font-bold text-5xl cursor-pointer mr-5"><FaRegUserCircle /></PopoverTrigger>
          <PopoverContent className="cursor-pointer flex flex-col items-center w-60 justify-center gap-2">
            <p className="font-bold border-2 w-full border-white hover:border-b-zinc-400 text-center" onClick={()=> navigate("/details")}>Profile Details</p>
            <p className="font-bold border-2 w-full border-white hover:border-b-zinc-400 text-center" onClick={()=> navigate("/codingPlayGround")}>Playground</p>
            
            <AlertDialog>
              <AlertDialogTrigger className="font-bold border-2 w-full cursor-pointer border-white hover:border-b-zinc-400 text-center">Log Out</AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-none shadow-md shadow-green-400">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-green-400">You want to log out?</AlertDialogTitle>
                  <AlertDialogDescription className="text-green-700">
                   Hopefully will see you again
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-400 text-white cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-green-600 cursor-pointer hover:bg-green-400" onClick={handleLogOut }>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </PopoverContent>
        </Popover> :
          <Link to={"/userEntry"} className="absolute hover:outline-2 hover:outline-offset-2 hover:outline-green-300 top-5 right-50 bg-green-700 rounded font-bold text-xl cursor-pointer text-white hover:bg-green-500 pl-7 pr-7 pt-2 pb-2 ">

            <button className="cursor-pointer flex items-center gap-2"> <IoLogIn />Login / <GiArchiveRegister />Signup</button>

          </Link>
      }

      <Description />
      <div className="flex items-center gap-2 justify-around flex-col md:flex-row mt-20">

        <SpotlightCard className="custom-spotlight-card  w-1/4 text-green-300 cursor-pointer" spotlightColor="rgba(74, 222, 128, 0.2)">
          <p className="p-2 font-bold text-xl  text-green-700">Real-Time Collaboration</p>
          <p className="p-2">Multiple users can code together in the same environment, see live changes, and chat in real-time — perfect for pair programming or group sessions.</p>

        </SpotlightCard>
        <SpotlightCard className="custom-spotlight-card w-1/4 text-green-300 cursor-pointer" spotlightColor="rgba(74, 222, 128, 0.2)">
          <p className="p-2 font-bold text-xl  text-green-700">Isolated Docker Environments</p>
          <p className="p-2">Each user gets a private containerized coding space powered by Docker, ensuring secure and consistent environments for every project.</p>

        </SpotlightCard>
        <SpotlightCard className="custom-spotlight-card w-1/4 text-green-300 cursor-pointer" spotlightColor="rgba(74, 222, 128, 0.2)">
          <p className="p-2 font-bold text-xl  text-green-700">
            Integrated Terminal & Chat
          </p>
          <p className="p-2">
            A built-in terminal lets users run code and commands directly, while the side chat keeps the communication seamless within coding rooms.
          </p>

        </SpotlightCard>
      </div>


      <div className="w-full max-w-screen flex mt-50 mb-10">
        <div className="w-1/2 flex flex-col items-center justify-center text-green-700 ">
          <p className="font-bold text-md text-start w-[80%] text-green-500">Code in your favorite major languages</p>
          <p className="text-start w-[80%]">
            Code Nimbus currently supports popular languages, with more coming soon in future updates.
          </p>
        </div>
        <div className="w-1/2 grid grid-cols-3 grid-rows-3 gap-5 text-white  ">
          <p className="flex items-center gap-2 text-xl"> <span><IoLogoJavascript className="text-2xl" /></span>JavaScript</p>
          <p className="flex items-center gap-2 text-xl"> <span><TbBrandCSharp className="text-2xl" /></span>c</p>
          <p className="flex items-center gap-2 text-xl"><span><FaJava className="text-2xl" /></span>Java</p>
          <p className="flex items-center gap-2 text-xl"><span><SiPython className="text-2xl" /></span>Python</p>
          <p className="flex items-center gap-2 text-xl"><span><FaGolang className="text-2xl" /></span>Go</p>
          <p className="flex items-center gap-2 text-xl"><span><FaRust className="text-2xl" /></span>Rust</p>
          <p className="flex items-center gap-2 text-xl"><span><FaPhp className="text-2xl" /></span>Php</p>
          <p className="flex items-center gap-2 text-xl"><span><DiRuby className="text-2xl" /></span>Ruby</p>
          <p className="flex items-center gap-2 text-xl"><span><GrMysql className="text-2xl" /></span>Sql</p>
        </div>
      </div>

      <footer className="bg-zinc-900 text-green-400 py-8 mt-20 px-4 text-sm flex flex-col md:flex-row items-center justify-between border-t border-green-400">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>© {new Date().getFullYear()} Code Nimbus — Empowering developers worldwide.</p>
          <p className="text-xs mt-1 text-green-500">Open-source • Built by the community, for the community</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 " >
          <a href="https://github.com/RohitDutta-web/CLOUD-IDE" target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
            💻 Contribute on GitHub
          </a>
          <a href="https://github.com/RohitDutta-web/CLOUD-IDE" className="hover:underline">Documentation</a>
          <a href="#community" className="hover:underline">Join Community</a>
          <a href="mailto:duttarohit754@gmail.com" className="hover:underline">Contact</a>
        </div>
      </footer>

    </>
  )
}
