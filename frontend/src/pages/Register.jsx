import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { validators } from "../utils/validators.js";

export default function Register() {
  const { register: doRegister, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { name: "", email: "", password: "", role: "landlord" } });

  const onSubmit = async (values) => {
    await doRegister(values);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 text-center">
            <div className="text-xl font-bold text-gray-900">Create account</div>
            <div className="text-sm text-gray-500 mt-1">Start managing your rentals in minutes.</div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <label className="relative flex cursor-pointer rounded-xl border-2 p-3 transition-all has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50 hover:border-gray-300">
                <input
                  type="radio"
                  value="landlord"
                  className="sr-only"
                  {...register("role", { required: true })}
                />
                <div className="flex flex-col items-center justify-center w-full">
                  <span className="text-xs font-semibold text-gray-900">Landlord</span>
                </div>
              </label>
              <label className="relative flex cursor-pointer rounded-xl border-2 p-3 transition-all has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50 hover:border-gray-300">
                <input
                  type="radio"
                  value="tenant"
                  className="sr-only"
                  {...register("role", { required: true })}
                />
                <div className="flex flex-col items-center justify-center w-full">
                  <span className="text-xs font-semibold text-gray-900">Tenant</span>
                </div>
              </label>
            </div>

            <Input
              label="Name"
              placeholder="Your name"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Email"
              type="text"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", validators.email)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" }
              })}
            />
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5" disabled={loading} type="submit">
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="font-semibold text-emerald-700 hover:underline" to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
