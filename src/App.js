import './App.css';
import React from "react";
import { Home } from "./pages/home/index";
import { Register } from "./pages/register/index";
import { NewPrint } from "./pages/prints/newPrint";
import { NewTag } from "./pages/prints/newTag";
import { EditPrint } from "./pages/prints/editPrint";
import PageNotFound from './pages/notFound/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthContext } from "./helpers/AuthContext";
import { useLogin } from "./hooks/useLogin";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "./config/firebase-config";
import { SocialIcon } from 'react-social-icons';
import straruIcon from "./img/straruberry-icon.png";

function App() {
  const [authState, setAuthState] = useState({
    id: '',
    email: '',
    admin: false,
    status: false
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        setAuthState({
          id: uid,
          email: user.email,
          admin: userDoc.data().admin,
          status: true,
        });
      } else {
        setAuthState({
          id: '',
          email: '',
          admin: false,
          status: false,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const handleLogin = async () => {
    try {
      const user = await login(email, password, setAuthState, localStorage);
      setAuthState({
        id: user.id,
        email: email,
        admin: user.admin,
        status: true,
      });
      localStorage.setItem("auth", user.id);
    } catch (error) {
      alert(error.message || "Error durante el inicio de sesión");
    }
  };

  const logout = () => {
    setAuthState({
      id: '',
      email: '',
      admin: false,
      status: false
    });
    localStorage.removeItem("auth");
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <Link to="/" className="navbar-brand ms-4 fs-1 straru-navBar">Straruberry</Link>
              <button className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse bg-dark" id="navbarSupportedContent">
                {authState.admin && (
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item active my-auto mx-3">
                      <Link to="/newprint" className="navbarItem">
                        Añadir print
                      </Link>
                    </li>
                    <li className="nav-item active my-auto mx-3">
                      <Link to="/newtag" className="navbarItem">
                        Añadir etiqueta
                      </Link>
                    </li>
                    <li className="nav-item active my-auto mx-3">
                      <Link to="/editprint" className="navbarItem">
                        Editar prints
                      </Link>
                    </li>
                  </ul>
                )}
                {authState.status ? (
                  <div className="d-flex ms-auto">
                    <p className="my-auto mx-3">{authState.email}</p>
                    <button type="button" className="btn btn-outline-primary me-4" onClick={logout}>
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <form className="d-flex ms-auto me-4 navBarForm">
                    <div className='row'>
                      <input
                        type="text"
                        className="col-8 col-md-3 ms-auto ms-md-2 my-2"
                        placeholder="Correo"
                        aria-label="Correo"
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                      />
                      <input
                        type="password"
                        className="col-8 col-md-3 ms-auto my-2 ms-md-2 my-2"
                        placeholder="Contraseña"
                        aria-label="Contraseña"
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary col-8 col-md-3 ms-auto ms-md-2 my-2"
                        onClick={handleLogin}
                      >
                        Iniciar sesión
                      </button>
                      <Link
                        to="/register"
                        className="btn btn-outline-primary col-8 col-md-2 ms-auto ms-md-2 my-2"
                      >
                        Registrarse
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" exact element={<Home authState={authState} setAuthState={setAuthState} />} />
            <Route path="/register" exact element={<Register authState={authState} setAuthState={setAuthState} />} />
            <Route path="/newprint" element={<NewPrint authState={authState} setAuthState={setAuthState} />} />
            <Route path="/newtag" element={<NewTag authState={authState} setAuthState={setAuthState} />} />
            <Route path="/editprint" element={<EditPrint authState={authState} setAuthState={setAuthState} />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>

          <footer className="bg-dark text-center text-white">
            <div className="container p-4">
              {/* <section className="mb-4">
                <h3>
                  Redes sociales
                </h3>
              </section> */}
              <section className="my-auto">
                <a href="https://straruberry.carrd.co/" target="_blank" rel="noreferrer noopener" className='mx-2'>
                  <img src={straruIcon} alt="straruberry-icon" className='img-fluid rounded-circle straruIcon' />
                </a>
                <SocialIcon className="mx-2" url="https://twitter.com/Straruberry" target="_blank" rel="noreferrer noopener" />
                <SocialIcon className="mx-2" url="https://www.instagram.com/straruberry" target="_blank" rel="noreferrer noopener" />
                {/* <SocialIcon className="mx-2" url="https://straruberry.carrd.co/" /> */}
              </section>
              {/* <section className="">
                <a href="mailto:rafaeljoseossoriolopez@gmail.com" target="_blank" rel="noreferrer noopener">
                  <h3>
                    Contacto: rafaeljoseossoriolopez@gmail.com
                  </h3>
                </a>
              </section> */}
            </div>
          </footer>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;