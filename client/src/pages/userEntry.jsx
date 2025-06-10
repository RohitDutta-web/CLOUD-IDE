import LogInImage from "../assets/login-image.png";
import { useState, useEffect, useRef } from "react";
import signUpImage from "../assets/Create-new-client-accounts.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/userSlice.js";


export default function UserEntry() {

  const dispatch = useDispatch();

  const [logInForm, setLogInForm] = useState({
    email: "",
    password: "",
  });

  const handleLogInForm = (e) => {
    let { name, value } = e.target;

    setLogInForm((prev) => (
      {
        ...prev,
        [name]: value
      }
    ))
  }
  const logInHandler = async (e) => {
    e.preventDefault();

    try {
      console.log(logInForm);

      const data = await axios.post(import.meta.env.VITE_BACKEND_LOGIN, logInForm,
        {
          headers: {
            'Content-Type': 'application/json',

          },
          withCredentials: true,
        }
      )
console.log(data);

       if (data.response?.data?.success) {
        dispatch.setUser({
          email: data.data?.user?.email,
          username: data.data?.user?.username,
          isLoggedIn: true,
          isGuest: data.data?.user?.guest
        })

        
      } 


    }
    catch (e) {
      console.log(e);

    }
  }


  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: ""

  })


  const signUpFormHandler = (e) => {
    const { name, value } = e.target;

    setSignUpForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_BACKEND_SIGNUP, signUpForm, {
        headers: {
          "Content-Type": "application/json"
        }
      })
    }
    catch (e) {
      console.log(e);

    }
  }
  const isRendered = useRef(false);

  useEffect(() => {
    if (isRendered.current) return;
    isRendered.current = true;


  }, [])

  let [userEntry, setUSerEntry] = useState("login");

  const btnLogin = () => {
    setUSerEntry("login");
  }

  const btnSignup = () => {
    setUSerEntry("signup")
  }

  return (
    <>
      <div className=" w-screen max-w-screen p-2 h-screen flex justify-center items-center bg-zinc-800">
        <div className="rounded-lg w-screen max-w-screen  p-2 flex flex-col items-center  h-auto">


          <div className="flex bg-zinc-700 absolute w-[500px] top-[10%]  max-w-screen rounded-full justify-between gap-5 p-2 font-bold items-center text-zinc-500">
            <button onClick={btnLogin} className={userEntry === "login" ? "bg-green-500 cursor-pointer w-1/3 text-white rounded-full pt-1 pb-1 pl-2 pr-2 " : "hover:bg-green-900 cursor-pointer w-1/3 hover:text-white rounded-full pt-1 pb-1 pl-2 pr-2 "} >Log In</button>
            <button onClick={btnSignup} className={userEntry === "signup" ? "bg-green-500 cursor-pointer w-1/3 text-white rounded-full pt-1 pb-1 pl-2 pr-2 " : "hover:bg-green-900 cursor-pointer w-1/3 hover:text-white rounded-full pt-1 pb-1 pl-2 pr-2 "}>Sign Up</button>
          </div>

          {
            userEntry === "login" ? <div className="flex  items-center mt-5">
              <img src={LogInImage} alt="Login" className="w-1/2 " />

              <form action="" className="flex flex-col gap-5 mt-5 w-1/2 items-center  ">
                <input placeholder="Email" type="email" name="email" id="email" className=" w-1/2 bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" onChange={handleLogInForm} value={logInForm.email} />
                <input placeholder="Password" className="bg-zinc-700 pl-2 pr-2 pt-1 w-1/2 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" type="password" name="password" id="password" onChange={handleLogInForm}  value={logInForm.password}/>
                <input type="submit" value="Log In" className="w-1/2 bg-green-700 hover:bg-green-500 cursor-pointer hover:outline-2 hover:outline-offset-2 hover:outline-green-500 rounded-full pt-1 pb-1 font-bold" onClick={logInHandler} />
              </form>


            </div> :
              <div className="flex  items-center mt-5">
                <img src={signUpImage} alt="signup" className="w-1/2 " />

                <form action="" className="flex flex-col gap-5 mt-5 w-1/2 items-center  ">
                  <input placeholder="Username" type="text" name="username" id="" className=" w-1/2 bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" onChange={signUpFormHandler}  value={signUpForm.username}/>
                  <input placeholder="Email" type="email" name="email" id="" className=" w-1/2 bg-zinc-700 pl-2 pr-2 pt-1 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" onChange={signUpFormHandler}  value={signUpForm.email}/>
                  <input placeholder="Password" className="bg-zinc-700 pl-2 pr-2 pt-1 w-1/2 pb-1 font-bold text-zinc-500 rounded-full focus:outline-2 focus:outline-offset-2 focus:outline-green-700" type="password" name="password" id="" onChange={signUpFormHandler} value={signUpForm.password} />
                  <input type="submit" value="Sign up" className="w-1/2 bg-green-700 hover:bg-green-500 cursor-pointer hover:outline-2 hover:outline-offset-2 hover:outline-green-500 rounded-full pt-1 pb-1 font-bold" onClick={handleSignUp} />
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
