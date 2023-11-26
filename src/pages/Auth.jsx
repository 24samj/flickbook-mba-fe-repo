import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signIn } from "../api/auth";
import { AxiosInstance } from "../util/axiosInstances";
import wallpaper from "../assets/4k_mba_wallpaper.jpg";
import "./Auth.css";

const Auth = () => {
    const [showSignup, setShowSignup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const navigate = useNavigate();
    const initialLoginFormValues = {
        userId: "",
        password: "",
    };

    const initialSignupFormValues = {
        userId: "",
        password: "",
        email: "",
        username: "",
        userType: "CUSTOMER",
    };

    const [loginFormValues, setLoginFormValues] = useState(
        initialLoginFormValues
    );

    const [signupFormValues, setSignupFormValues] = useState(
        initialSignupFormValues
    );

    useEffect(() => {
        if (localStorage.getItem("token")) {
            switch (localStorage.getItem("userTypes")) {
                case "CUSTOMER":
                    navigate("/");
                    break;
                case "CLIENT":
                    navigate("/client");
                    break;
                case "ADMIN":
                    navigate("/admin");
                    break;
                default:
            }
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setIsProcessing(true);
            const data = await signIn(
                loginFormValues.userId,
                loginFormValues.password
            );

            toast.success("Logged in successfully!");
            switch (data.userTypes) {
                case "CUSTOMER":
                    navigate("/");
                    break;
                case "CLIENT":
                    navigate("/client");
                    break;
                case "ADMIN":
                    navigate("/admin");
                    break;
                default:
            }
        } catch (ex) {
            console.log(ex);
            if (ex.message === "APPROVAL PENDING") {
                toast.error("Admin is yet to approve your sign in request");
                return;
            }
            toast.error(ex.response.data.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            setIsProcessing(true);
            await AxiosInstance.post("/mba/api/v1/auth/signup", {
                userId: signupFormValues.userId,
                password: signupFormValues.password,
                name: signupFormValues.username,
                email: signupFormValues.email,
                userType: signupFormValues.userType,
            });
            setShowSignup(false);
            toast.success("Signup done. Please login with your credentials!");
        } catch (ex) {
            setErrorMessage(ex.response.data.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleSignup = () => {
        setShowSignup(!showSignup);
    };

    const handleLoginFormChange = (event) =>
        setLoginFormValues({
            ...loginFormValues,
            [event.target.name]: event.target.value,
        });

    const handleSignupFormChange = (event) =>
        setSignupFormValues({
            ...signupFormValues,
            [event.target.name]: event.target.value,
        });

    return (
        <div id="loginPage">
            <div
                className="loginContainer d-flex justify-content-center align-items-center vh-100"
                style={{
                    background: `url(${wallpaper}) center/cover no-repeat`,
                }}>
                <div className="loginCard m-5 p-5">
                    <div
                        className="text-center"
                        style={{
                            fontSize: "36px",
                            color: "white",
                            fontWeight: "900",
                            fontFamily: "Montserrat",
                        }}>
                        FlickBook
                    </div>
                    <div className="row m-2">
                        <div className="col">
                            {!showSignup && (
                                <div>
                                    <h4
                                        className="text-center"
                                        style={{ color: "white" }}>
                                        Login
                                    </h4>
                                    <form onSubmit={handleLogin}>
                                        <div className="input-group m-1">
                                            <input
                                                type="text"
                                                className="textField form-control"
                                                placeholder="User Id"
                                                name="userId"
                                                value={loginFormValues.userId}
                                                onChange={handleLoginFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group m-1">
                                            <input
                                                type="password"
                                                className="textField form-control"
                                                placeholder="Password"
                                                name="password"
                                                value={loginFormValues.password}
                                                onChange={handleLoginFormChange}
                                                required
                                            />
                                        </div>
                                        <div className=" input-group m-1">
                                            <input
                                                type="submit"
                                                className="submitBtn form-control btn btn-danger"
                                                value={
                                                    isProcessing
                                                        ? "Logging in..."
                                                        : "Login"
                                                }
                                                disabled={isProcessing}
                                            />
                                        </div>
                                        <div
                                            className="signupPrompt signup-btn text-right text-info"
                                            style={{ cursor: "pointer" }}
                                            onClick={toggleSignup}>
                                            Don't have an account? Signup.
                                        </div>
                                        <div className="auth-error-msg text-danger text center">
                                            {errorMessage}
                                        </div>
                                    </form>
                                </div>
                            )}
                            {showSignup && (
                                <div>
                                    <h4
                                        className="text-center"
                                        style={{ color: "white" }}>
                                        Signup
                                    </h4>
                                    <form onSubmit={handleSignup}>
                                        <div className="input-group m-1">
                                            <input
                                                type="text"
                                                className="textField form-control"
                                                placeholder="User Id"
                                                value={signupFormValues.userId}
                                                name="userId"
                                                onChange={
                                                    handleSignupFormChange
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="input-group m-1">
                                            <input
                                                type="text"
                                                className="textField form-control"
                                                placeholder="Username"
                                                name="username"
                                                required
                                                value={
                                                    signupFormValues.username
                                                }
                                                onChange={
                                                    handleSignupFormChange
                                                }
                                            />
                                        </div>
                                        <div className="input-group m-1">
                                            <input
                                                type="text"
                                                className="textField form-control"
                                                name="email"
                                                placeholder="Email"
                                                required
                                                value={signupFormValues.email}
                                                onChange={
                                                    handleSignupFormChange
                                                }
                                            />
                                        </div>
                                        <div className="input-group m-1">
                                            <input
                                                type="password"
                                                name="password"
                                                className="textField form-control"
                                                placeholder="Password"
                                                value={
                                                    signupFormValues.password
                                                }
                                                onChange={
                                                    handleSignupFormChange
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="input-group m-1">
                                            <Form.Select
                                                className="textField"
                                                aria-label="User Type Selection"
                                                value={
                                                    signupFormValues.userType
                                                }
                                                onChange={
                                                    handleSignupFormChange
                                                }
                                                name="userType">
                                                <option disabled value="">
                                                    Select a user type
                                                </option>
                                                <option
                                                    className="listOption"
                                                    value="CUSTOMER">
                                                    CUSTOMER
                                                </option>
                                                <option
                                                    className="listOption"
                                                    value="CLIENT">
                                                    CLIENT
                                                </option>
                                                <option
                                                    className="listOption"
                                                    value="ADMIN">
                                                    ADMIN
                                                </option>
                                            </Form.Select>
                                        </div>

                                        <div className="input-group m-1">
                                            <input
                                                type="submit"
                                                className="submitBtn form-control btn btn-danger"
                                                value={
                                                    isProcessing
                                                        ? "Signing up..."
                                                        : "Signup"
                                                }
                                                disabled={isProcessing}
                                            />
                                        </div>
                                        <div
                                            className="loginPrompt signup-btn text-center text-info"
                                            style={{ cursor: "pointer" }}
                                            onClick={toggleSignup}>
                                            Already have an account? Log in.
                                        </div>
                                        <div className="auth-error-msg text-danger text center">
                                            {errorMessage}
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
