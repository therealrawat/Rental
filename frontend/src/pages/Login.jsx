import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Lock, UserCircle } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    mode: "onChange",
    defaultValues: { email: "", password: "" } 
  });

  const onSubmit = async (values) => {
    await login(values);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#5a1a36] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
        
        {/* Left Panel */}
        <div className="relative overflow-hidden md:w-[40%] bg-[#9e3a6a] min-h-[200px] md:min-h-full flex items-center justify-center">
          {/* Geometric shapes using tailwind */}
          <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[150%] bg-[#832c54] origin-top-left -rotate-[35deg]" />
          <div className="absolute top-[10%] left-[-20%] w-[150%] h-[150%] bg-[#b75d88] origin-top-left -rotate-[35deg] shadow-[0_0_15px_rgba(0,0,0,0.2)]" />
          <div className="absolute top-[35%] left-[-20%] w-[150%] h-[150%] bg-[#a34471] origin-top-left -rotate-[35deg] shadow-[0_0_15px_rgba(0,0,0,0.2)]" />
          <div className="absolute top-[60%] left-[-20%] w-[150%] h-[150%] bg-[#943863] origin-top-left -rotate-[35deg] shadow-[0_0_15px_rgba(0,0,0,0.2)]" />

          {/* Tabs overlay */}
          <div className="absolute left-0 top-[40%] w-full flex-col items-end hidden md:flex space-y-4">
             {/* Active Tab */}
             <div className="bg-white text-black font-extrabold py-3 px-8 rounded-l-full shadow-md z-10 w-32 text-center text-sm tracking-widest relative">
                LOGIN
             </div>
             {/* Inactive Tab */}
             <Link to="/register" className="text-white/80 font-bold py-3 px-8 w-32 text-center text-sm tracking-widest hover:text-white transition-colors relative z-10 whitespace-nowrap">
                REGISTER
             </Link>
          </div>
          
          {/* Mobile Tabs */}
          <div className="absolute inset-0 flex items-center justify-center space-x-4 md:hidden z-10">
            <div className="bg-white text-[#9e3a6a] font-extrabold py-2 px-6 rounded-full shadow-md text-sm tracking-widest">
              LOGIN
            </div>
            <Link to="/register" className="text-white/80 font-bold py-2 px-6 text-sm tracking-widest hover:text-white transition-colors whitespace-nowrap">
              REGISTER
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-[60%] bg-white p-8 md:p-12 flex flex-col items-center justify-center relative">
          
          {/* Logo Icon */}
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-[#9e3a6a] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-[#c66897] via-[#a34471] to-[#71163e] rounded-full flex items-center justify-center shadow-xl relative ring-4 ring-white">
               <UserCircle className="w-11 h-11 text-white" strokeWidth={1.5} />
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-[#943863] tracking-widest mb-10">LOGIN</h2>

          <form className="w-full max-w-[280px] space-y-8" onSubmit={handleSubmit(onSubmit)}>
             {/* Email Input */}
             <div className="relative">
               <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
               <input 
                 type="email" 
                 placeholder="Email"
                 className="w-full pl-9 py-2 border-b-2 border-gray-200 outline-none focus:border-[#943863] transition-colors text-sm font-medium text-gray-700 bg-transparent placeholder-gray-400"
                 {...register("email", { required: "Email is required" })}
               />
               {errors.email && <span className="text-[10px] text-red-500 absolute -bottom-4 left-0">{errors.email.message}</span>}
             </div>
             
             {/* Password Input */}
             <div className="relative">
               <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
               <input 
                 type="password" 
                 placeholder="Password"
                 className="w-full pl-9 py-2 border-b-2 border-gray-200 outline-none focus:border-[#943863] transition-colors text-sm font-medium text-gray-700 bg-transparent placeholder-gray-400"
                 {...register("password", { required: "Password is required" })}
               />
               {errors.password && <span className="text-[10px] text-red-500 absolute -bottom-4 left-0">{errors.password.message}</span>}
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-end pt-4 space-y-6 sm:space-y-0 w-full">
               {/* <a href="#" className="text-[11px] text-[#b75d88] hover:text-[#943863] transition-colors font-bold tracking-wide w-full sm:w-auto text-left">Forgot Password?</a> */}
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full sm:w-auto bg-gradient-to-r from-[#b75d88] to-[#943863] text-white px-10 py-2.5 rounded-full font-bold text-xs tracking-widest shadow-md shadow-[#943863]/30 hover:shadow-lg hover:shadow-[#943863]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
               >
                 {loading ? "..." : "LOGIN"}
               </button>
             </div>
          </form>

          {/* Tagline */}
          <div className="w-full max-w-[280px] mt-12 pt-6 border-t border-gray-100 flex items-center justify-center">
            <span className="text-xs font-medium italic text-gray-400 tracking-widest">Home away from home</span>
          </div>
          
        </div>
      </div>
    </div>
  );
}
