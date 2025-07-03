import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { toast } from "sonner";

export default function UserDetails() {
  const [doEdit, setDoEdit] = useState(false);
  const handleDoEdit = () => {
    setDoEdit(!doEdit);
    toast("Activated");
  }

  return (
    <>
      <div className="w-full max-w-screen ">
        <p className="w-full text-center pt-10 text-2xl  text-green-400 font-bold pb-10">Profile details</p>
        <div className="w-full">
          <form className="bg-zinc-400 w-[50%] h-auto rounded flex flex-col p-5 gap-5 ">
             {
                doEdit ?  <GiConfirmed className="text-4xl p-2 rounded hover:text-white cursor-pointer relative  hover:bg-zinc-800"  onClick={handleDoEdit}/>: <FaEdit className="text-4xl p-2 rounded hover:text-white cursor-pointer relative  hover:bg-zinc-800"  onClick={handleDoEdit}/>
               }
            
            <div className="group flex items-center  bg-white opacity-75  group-focus-within:shadow-xl p-2 rounded">
              <input type="text" placeholder={"Your user name"} className="w-[90%] bg-transparent outline-none p-1 focus:shadow-xl" />
             
            </div>
            <div className="group flex items-center  bg-white opacity-75  group-focus-within:shadow-xl p-2 rounded">
              <input type="email" placeholder={"Your email id"} className="w-[90%] bg-transparent outline-none p-1 focus:shadow-xl" />
            
            </div>

          </form>
          
        </div>
      </div>
    </>
  )
}
