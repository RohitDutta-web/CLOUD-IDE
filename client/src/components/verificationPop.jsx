import axios from "axios";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { verified } from "../utils/userSlice.js";

export default function VerificationPop() {
  const verification = useSelector((state) => state.user.user.verification)
  const dispatch = useDispatch();

  
  const handleEmailVerification = async () => {
  
    try {
      const response = await axios.get(import.meta.env.VITE_EMAIL_VERIFICATION, {
         withCredentials:true
      });

      if (response.data?.success) {
        toast(response.data?.message);
        dispatch(verified(response.data?.success));
       }
     }
    catch (e) {
      console.log(e);
      
    }
  }
  return (
    <>
      <div className={ verification ? 'w-full shadow-2xl shadow-white p-2 hidden bg-green-400/30 ':'w-full shadow-2xl shadow-white p-2 flex justify-center bg-green-400/30 fixed bottom-0' } >
        <div className='flex  w-[80%] items-center justify-between bg-transparent font-bold '>
          <p className='opacity-100'>Verify your email for full access</p>
          <button className='bg-green-500 pl-5 pr-5 pt-3 rounded shadow-2xl shadow-green-700 pb-3 opacity-100 cursor-pointer' onClick={handleEmailVerification}>Verify email</button>
       </div>

      </div>
    </>
  )
}
