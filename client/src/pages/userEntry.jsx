import LogInImage from "../assets/login-image.png";
import { useState } from "react";
import signUpImage from "../assets/Create-new-client-accounts.png";


export default function UserEntry() {

  let [userEntry, setUSerEntry] = useState("login");
  
  const btnLogin = () => {
    setUSerEntry("login");
  }

  const btnSignup = () => {
    setUSerEntry("signup")
  }
 
  return (
    <>
      <div className=" w-screen p-2 h-screen flex justify-center items-center bg-zinc-800">
        <div className="rounded-lg   p-2 flex flex-col items-center  h-auto">


          <div className="flex bg-zinc-700 w-1/2 lg:w-1/3 rounded-full justify-between gap-5 p-2 font-bold items-center text-zinc-500">
            <button onClick={btnLogin} className={ userEntry === "login" ? "bg-green-500 cursor-pointer w-1/3 text-white rounded-full pt-1 pb-1 pl-2 pr-2 " : "hover:bg-green-900 cursor-pointer w-1/3 hover:text-white rounded-full pt-1 pb-1 pl-2 pr-2 " } >Log In</button>
            <button onClick={btnSignup} className={ userEntry === "signup" ? "bg-green-500 cursor-pointer w-1/3 text-white rounded-full pt-1 pb-1 pl-2 pr-2 " : "hover:bg-green-900 cursor-pointer w-1/3 hover:text-white rounded-full pt-1 pb-1 pl-2 pr-2 " }>Sign Up</button>
          </div>

          {
            userEntry === "login" ? <div className="flex  items-center mt-5">
            <img src={LogInImage } alt="Login" className="w-1/2 " />

            <form action="" className="flex flex-col gap-5 mt-5 w-1/2 items-center  ">
              <input placeholder="Email" type="email" name="" id="" className=" w-1/2 bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" />
              <input placeholder="Password" className="bg-zinc-700 pl-2 pr-2 pt-1 w-1/2 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" type="password" name="" id="" />
              <input type="submit" value="Log In" className="w-1/2 bg-green-700 hover:bg-green-500 cursor-pointer hover:outline-2 hover:outline-offset-2 hover:outline-green-500 rounded-full pt-1 pb-1 font-bold" />
            </form>


            </div> :
              <div className="flex  items-center mt-5">
            <img src={signUpImage } alt="signup" className="w-1/2 " />

                <form action="" className="flex flex-col gap-5 mt-5 w-1/2 items-center  ">
                <input placeholder="Username" type="text" name="" id="" className=" w-1/2 bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" />
              <input placeholder="Email" type="email" name="" id="" className=" w-1/2 bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" />
              <input placeholder="Password"  className="bg-zinc-700 pl-2 pr-2 pt-1 w-1/2 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" type="password" name="" id="" />
              <input type="submit" value="Sign up" className="w-1/2 bg-green-700 hover:bg-green-500 cursor-pointer hover:outline-2 hover:outline-offset-2 hover:outline-green-500 rounded-full pt-1 pb-1 font-bold" />
            </form>


          </div>
          }

          <div className="mt-3 font-bold text-md text-zinc-600">
            Want to login as a guest ? <button className="text-lg bg-green-800 text-zinc-400 p-2 m-1 rounded hover:bg-green-400 hover:text-white hover:outline-2 hover:outline-offset-2 hover:outline-green-400 cursor-pointer">Guest Login</button>
          </div>

        </div>

      </div>
    </>
  )
}
