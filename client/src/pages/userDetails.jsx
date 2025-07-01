import { FaEdit } from "react-icons/fa";

export default function UserDetails() {
  return (
    <>
      <div className="w-full max-w-screen ">
        <p className="w-full text-center pt-10 text-2xl  text-green-400 font-bold pb-10">Profile details</p>
        <div className="w-full">
          <form className="bg-zinc-400 w-[50%] h-auto rounded flex flex-col p-5 gap-5 ">
            <div className="flex items-center bg-white opacity-50 p-2 rounded">
              <input type="text" placeholder={"Your user name"} className="w-[90%] bg-transparent outline-none"/>
               <FaEdit className="text-4xl p-2 rounded hover:text-white cursor-pointer hover:bg-zinc-800" />
            </div>
            <div className="flex items-center bg-white opacity-50 p-2 rounded">
              <input type="text" placeholder={"Your email id"} className="w-[90%] bg-transparent outline-none"/>
              <FaEdit className="text-4xl p-2 rounded hover:text-white cursor-pointer hover:bg-zinc-800" />
            </div>
           
        </form>
        </div>
      </div>
    </>
  )
}
