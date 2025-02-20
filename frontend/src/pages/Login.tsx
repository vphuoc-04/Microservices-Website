import * as React from "react"
import { useNavigate } from "react-router-dom";

import { SubmitHandler, useForm } from "react-hook-form"

// Services
import { login } from "../services/AuthService";

// Redux
import { useDispatch } from "react-redux";
import { setToast } from "../redux/slice/toastSlice";

type Inptus = {
    email: string,
    password: string,
}

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, setFocus, formState: { errors } } = useForm<Inptus>();
    const [loading, setLoading] = React.useState<boolean>(false)
    const [show, setShow] = React.useState<boolean>(false);

    // Login
    const loginHandler: SubmitHandler<Inptus> = async (payload) => {
        setLoading(true);
        try {
            const logged = await login(payload);
            if (logged) {
                dispatch(setToast({ message: 'Login successfully', type: 'success' }))
                navigate('/admin/dashboard');
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    
    React.useEffect(() => {
        setFocus("email")
        setFocus("password")
    }, [setFocus])

    return (
        <div className="login">
            <div className="form-container">
                <div className="slogan-login">
                    <h2>Welcome Back Admin</h2>
                    <p>We are always here waiting for you to come back.
                    <br />We are so happy to have been created by you in this world.
                    <br />We wish you a good day.</p>
                </div>
                <form onSubmit={handleSubmit(loginHandler)}>
                    <div className="input">
                        <div className="email-input">
                            <input 
                                id="email"
                                type="text"
                                placeholder="Email"
                                {...register("email", { required: true })}
                            />
                            {errors?.email && <span>*Email is required</span>}
                        </div>
                        <div className="password-input">
                            <input 
                                id="password"
                                type={show ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", { required: true })}
                            />
                            {errors?.password && <span>*Password is required</span>}
                            <div className = "show-or-hide">
                                <i 
                                    className = { show === true ? "fa-regular fa-eye" : "fa-regular fa-eye-slash" } 
                                    onClick = {() => setShow(!show) }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="login-button">
                        <button type = "submit" disabled = {loading}>
                            {loading ? <div className="spinner"></div> : "Login"}
                        </button>
                    </div>
                    <div className="forgot-password">
                        Forgot password?
                    </div>
                    <p>Welcome to the E-commerce Market, here is every product you want</p>
                </form>
            </div>
        </div>
    )
}

export { Login }