

export default function UserEntry() {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center bg-zinc-800">
        <div className="border-2 border-green-700 p-2  h-auto">


          <div className="flex bg-zinc-700 rounded-full justify-between gap-5 p-2 font-bold items-center text-zinc-500">
            <button className="focus:bg-green-700 focus:text-white rounded-full pt-1 pb-1 pl-2 pr-2 ">Log In</button>
            <button className="focus:bg-green-700 focus:text-white rounded-full pt-1 pb-1 pl-2 pr-2 ">Sign Up</button>
          </div>

          <div>
            <div></div>

            <form action="" className="flex flex-col gap-5 mt-5">
              <input placeholder="Email" type="email" name="" id="" className="bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" />
              <input placeholder="Password" className="bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" type="password" name="" id="" />
              <input type="submit" value="Log In" className="bg-green-700 hover:bg-green-500 cursor-pointer hover:outline-2 hover:outline-offset-2 hover:outline-green-500 rounded-full pt-1 pb-1 font-bold" />
            </form>


          </div>

        </div>

      </div>
    </>
  )
}
