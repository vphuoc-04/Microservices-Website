import * as React from "react"
import { useNavigate } from "react-router-dom";

import { SubmitHandler, useForm } from "react-hook-form"

// Services
import { login } from "../services/AuthService";

type Inptus = {
    email: string,
    password: string,
}

const Login = () => {
    const { register, handleSubmit, setFocus,  formState: { errors } } = useForm<Inptus>({

    });
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);

    const loginHandler: SubmitHandler<Inptus> = async (payload) => {
        const logged = await login(payload, setError);
        if (logged) {
            navigate('/admin/dashboard')
        }
    }

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
                                type="text"
                                placeholder="Passowrd"
                                {...register("password", { required: true })}
                            />
                            {errors?.password && <span>*Password is required</span>}
                        </div>
                    </div>
                    {error && <span>*Email or password incorrect</span>}
                    <div className="login-button">
                        <button type = "submit">
                            Login
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