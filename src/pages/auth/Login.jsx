import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../services/authService";
import { loginSuccess } from "../../redux/reducer/authReducer";
import logo from "../../assets/image/logoHUSC.png";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      dispatch(loginSuccess(response));

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setMessage("Đăng nhập thành công!");
      setMessageType("success");
      navigate("/");
    } catch (error) {
      setMessage("Sai email hoặc mật khẩu");
      setMessageType("error");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center max-w-lg w-full">
      <div className="w-full flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
          <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
          <span className="text-3xl font-bold tracking-wide text-blue-900">
            HUSC
          </span>
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700 outline outline-1 outline-gray-300">
          <div className="w-full p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng nhập vào tài khoản
            </h1>
            {message && (
              <div
                className={`text-center p-3 rounded-lg ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email không được để trống",
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@husc.edu.vn"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Mật khẩu không được để trống",
                  })}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Đăng nhập
              </button>
            </form>
            <div className="relative flex items-center justify-center w-full">
              <div className="w-full h-px bg-gray-300"></div>
              <span className="absolute px-2 bg-white text-gray-500 text-sm">
                hoặc
              </span>
            </div>

            <button
              onClick={() =>
                (window.location.href =
                  "https://school-social-be.onrender.com/api/auth/google")
              }
              className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              <img
                src="https://img.favpng.com/15/12/25/google-logo-google-adwords-g-suite-google-account-png-favpng-ZPDpvjf5PW8XaAnw6V9PQkcut.jpg"
                alt="Google"
                className="w-5 h-5"
              />
              Đăng nhập với Google
            </button>
            <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
              Chưa có tài khoản?{" "}
              <a
                href="register"
                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Đăng ký
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
