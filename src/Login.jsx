
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { getToken } from '/src/ApiTest'
import { AppContext } from './App';
import Page2 from './Page2';


function Login() {

    const [stepId, setStepId] = useState();
    const [stepPassword, setStepPassword] = useState();
    const [msg, setMsg] = useState("");
    const [spinningFast, setSpinningFast] = useState(false);



    if (sessionStorage.getItem("stepId") + "" != "null") {
        window.location.href = "/";
    }

    async function doLogin() {
        //setIsLoading(true)
        if (!checkValid()) {
            alert("'STEPID' & 'STEP PASSWORD' are required.");
            return;
        }

        setSpinningFast(true);
        const token = await getToken(stepId, stepPassword);

        if (token != "") {
            setMsg("Login Success.");
            sessionStorage.setItem("stepId", stepId);
            sessionStorage.setItem("stepPassword", stepPassword);
            sessionStorage.setItem("isMainWS", true);
            window.location.href = "/";
        } else {
            setMsg("Invalid UserId and Password.");
        }
        //setIsLoading(false)
        setSpinningFast(false);

    }

    function checkValid() {
        let isValid = true;
        if (stepId == null || stepId.length < 1 || stepPassword == null || stepPassword.length < 1) {
            isValid = false;
        }
        return isValid;
    }



    return (
        <>
            <div className='loginMain'>
                <div className='loginSub loginLeft'>

                    <div style={{ display: "flex", position: "relative" }}>
                        <div className='inputArea'>
                            <div>
                                <input type="text" placeholder='STEP ID' className='Input loginInput' value={stepId} onChange={(e) => { setStepId(e.target.value) }}></input>
                            </div>
                            <div style={{ position: "relative" }}>

                                <input type="password" placeholder='STEP PASSWORD' className='Input loginInput' value={stepPassword}
                                    onKeyDown={(e) => { if (e.key == "Enter") { doLogin(); } }}
                                    onChange={(e) => { setStepPassword(e.target.value) }}></input>

                            </div>
                            <input type='checkbox' id="decryption" style={{ display: "none" }} />
                            <div className='decryptedPw'>{stepPassword}</div>
                            <label for="decryption" className='decryptingBtn'>↹</label>

                        </div>
                        <div className='basicBtn loginStepBtn' onClick={doLogin} style={{ visibility: spinningFast ? "hidden" : "" }}>
                            <div><span>⨠</span></div>
                            Login
                        </div>
                    </div>
                </div>
                <div className='loginSub loginRight'>
                    <div style={{ position: "relative" }}>
                        <div className="logoArea">
                            <img className={!spinningFast ? "loginLogo" : "loginLogospinning_fast"} src="/graphql.png" width={"150"}></img>

                        </div>
                        <div>
                            <div className={!spinningFast ? "fadein" : "fadeout"}>GraphQL + STEP</div>
                            <div className='loginMsg' style={{ visibility: msg != "" ? "visible" : "hidden" }}>
                                {msg}
                            </div>
                        </div>

                    </div>
                </div>



            </div>
        </>


    );
}

export default Login;