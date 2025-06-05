import './App.css'
import { BrowserRouter, Routes, Route, Link, HashRouter } from 'react-router-dom'
import Page1 from '/src/Page1';
import Page2 from '/src/Page2';
import Page3 from '/src/Page3';
import StepMain from '/src/StepMain';
import { getToken } from './ApiTest';
import { createContext, useEffect, useRef, useState } from 'react';
import Login from './Login';

export const AppContext = createContext();


function App() {



  const [isLoading, setIsLoading] = useState(false);
  const [curPage, setCurPage] = useState(1);

  return (
    <AppContext.Provider value={{ isLoading, setIsLoading }}>
      <HashRouter>
        <div className='loadingDiv' style={{ display: isLoading ? null : "none" }}>
          {/* <span className="loader"></span> */}
          <img className='spinning_fast' src="/graphql.png" width={"80"} />
        </div>

        <div className='mainArea'>
          {/* <div className='topNav'>

            <div className={curPage == 1 ? "curPage" : ""}><Link to={"/Page1"} onClick={() => { setCurPage(1) }}>Page1</Link></div>
            <div className={curPage == 2 ? "curPage" : ""}><Link to={"/Page2"} onClick={() => { setCurPage(2) }}>Page2</Link></div>
            <div className={curPage == 3 ? "curPage" : ""}><Link to={"/Page3"} onClick={() => { setCurPage(3) }}>Search By STEPID</Link></div>
            <div className={curPage == 4 ? "curPage" : ""}><Link to={"/StepMain"} onClick={() => { setCurPage(4) }}>Hierarchy</Link></div>
            <div className={curPage == 5 ? "curPage" : ""}><Link to={"/Login"} onClick={() => { setCurPage(5) }}>Login</Link></div>

          </div> */}


          <div style={{ width: '100%', float: 'inline-start', marginTop: '5px' }}>
            <Routes>
              <Route path="/" element={<Login />}></Route>
              <Route path="/StepMain" element={<StepMain />}></Route>
              <Route path="/Page2" element={<Page2 />}></Route>
              <Route path="/Page3" element={<Page3 />}></Route>
              <Route path="/Page1" element={<Page1 />}></Route>
            </Routes>
          </div>

        </div>
      </HashRouter>
    </AppContext.Provider>
  )
}




export default App
