import { FaEdit } from "react-icons/fa";

export default function UserDetails() {
  return (
    <>
      <div className="w-full max-w-screen ">
        <p className="w-full text-center pt-10 text-2xl  text-green-400 font-bold pb-10">Profile details</p>
        <div className="w-full">
          <form className="bg-zinc-400 w-[50%] h-auto rounded flex flex-col p-5 ">
            <div >
              <input type="text" placeholder={"Your user name"} />
              <FaEdit />
            </div>
             <div >
              <input type="email" placeholder={"Your email id"} />
              <FaEdit />
            </div>
           
        </form>
        </div>
      </div>
    </>
  )
}
