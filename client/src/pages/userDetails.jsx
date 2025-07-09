import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { GiConfirmed } from "react-icons/gi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";


export default function UserDetails() {
  const user = useSelector((state) => state.user.user);
  const [doEdit, setDoEdit] = useState(false);
  const [gitHubUrl, setGitHubUrl] = useState();
  const [linkedInUrl, setLinkedInUrl] = useState();
   const handleLinkedInEntry = (e) => {
    setLinkedInUrl(e.target.value);
  }
   const handleLinkedIn = async () => {

    
    try {
          
      const response = await axios.post(import.meta.env.VITE_LINKEDIN, { url: linkedInUrl }, {
        withCredentials: true
      })

      if (response.data?.success) {
        toast(response.data?.message);
      }
     }
    catch (e) {
      console.log(e);
      
    }
  }
  
  const handleGitHubEntry = (e) => {
    setGitHubUrl(e.target.value);
  }
  const handleDoEdit = () => {
    setDoEdit(!doEdit);
  }

  const handleGitHub = async () => {

    
    try {
          
      const response = await axios.post(import.meta.env.VITE_GITHUB, { url: gitHubUrl }, {
        withCredentials: true
      })

      if (response.data?.success) {
        toast(response.data?.message);
      }
     }
    catch (e) {
      console.log(e);
      
    }
  }
  
  
  

  return (
    <>
      <div className="w-full max-w-screen flex flex-col items-center">
        <p className="w-full text-center pt-10 text-2xl  text-green-400 font-bold pb-10">Profile details</p>
        <div className="w-full flex flex-col  m-5 items-center">
          <form className="bg-zinc-400 w-[50%] h-auto rounded flex flex-col p-5 gap-5 ">
             {
                doEdit ?  <GiConfirmed className="text-4xl p-2 rounded hover:text-white cursor-pointer relative  hover:bg-zinc-800"  onClick={handleDoEdit}/>: <FaEdit className="text-4xl p-2 rounded hover:text-white cursor-pointer relative  hover:bg-zinc-800"  onClick={handleDoEdit}/>
               }
            
            <div className="group flex items-center  bg-white opacity-75  group-focus-within:shadow-xl p-2 rounded">
              <input type="text" placeholder={user.username} className="w-[90%] bg-transparent outline-none p-1 focus:shadow-xl" readOnly={!doEdit} />
             
            </div>
            <div className="group flex items-center  bg-white opacity-75  group-focus-within:shadow-xl p-2 rounded">
              <input type="email" placeholder={user.email} className="w-[90%] bg-transparent outline-none p-1 focus:shadow-xl" readOnly={!doEdit} />
            
            </div>

          </form>
          
        </div>

        <div className="w-[90%] flex flex-col gap-5 ">
          <div className="border-green-400 border-2 flex">
            <input type="email" placeholder={user.email} className="w-[90%] p-2 text-white bg-transparent  outline-none" />
            <button className="bg-green-400 font-bold pl-5 pr-5 pt-2 pb-2 cursor-pointer" style={{cursor: "blocked"}}>{user.verification ? "Verified":"Verify" }</button>
          </div>
          <div className="border-green-400 border-2 flex">
            <input type="text" placeholder="LinkedIn URL"  className="w-[90%] p-2 text-white bg-transparent outline-none" onChange={handleLinkedInEntry}/>
            <button className="bg-green-400 font-bold pl-5 pr-5 pt-2 pb-2 cursor-pointer" onClick={handleLinkedIn} >Modify</button>
          </div>
          <div className="border-green-400 border-2 flex">
            <input type="text" placeholder="Github URL"  className="w-[90%] p-2 text-white bg-transparent outline-none" onChange={handleGitHubEntry}/>
            <button className="bg-green-400 font-bold pl-5 pr-5 pt-2 pb-2 cursor-pointer" onClick={handleGitHub}>Modify</button>
          </div>
        </div>
      </div>
    </>
  )
}
