import LogInImage from "../assets/login-image.png";


export default function UserEntry() {
 
  return (
    <>
      <div className=" w-screen p-2 h-screen flex justify-center items-center bg-zinc-800">
        <div className="rounded-lg   p-2 flex flex-col items-center  h-auto">


          <div className="flex bg-zinc-700 w-1/2 lg:w-1/3 rounded-full justify-between gap-5 p-2 font-bold items-center text-zinc-500">
            <button className="focus:bg-green-700 w-1/3 focus:text-white rounded-full pt-1 pb-1 pl-2 pr-2 ">Log In</button>
            <button className="focus:bg-green-700 w-1/3 focus:text-white rounded-full pt-1 pb-1 pl-2 pr-2 ">Sign Up</button>
          </div>

          <div className="flex  items-center">
            <img src={LogInImage } alt="Login" className="w-1/2 " />

            <form action="" className="flex flex-col gap-5 mt-5 w-1/2 items-center  ">
              <input placeholder="Email" type="email" name="" id="" className=" w-1/2 bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" />
              <input placeholder="Password" className="bg-zinc-700 pl-2 pr-2 pt-1 w-1/2 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" type="password" name="" id="" />
              <input type="submit" value="Log In" className="w-1/2 bg-green-700 hover:bg-green-500 cursor-pointer hover:outline-2 hover:outline-offset-2 hover:outline-green-500 rounded-full pt-1 pb-1 font-bold" />
            </form>


          </div>

          

        </div>

      </div>
    </>
  )
}
