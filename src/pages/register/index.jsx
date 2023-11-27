import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from "../../hooks/useRegister";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../config/firebase-config";

export const Register = ({ authState, setAuthState }) => {
    let navigate = useNavigate();
    const { register } = useRegister();

    const initialValues = {
        email: "",
        password: "",
        passwordCheck: ""
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Correo electrónico inválido').required('Campo requerido'),
        password: Yup.string().min(5).max(20).required('Introduce la contraseña (5-20 caracteres).'),
        passwordCheck: Yup.string().oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden").required('Introduce la contraseña (5-20 caracteres).')
    });

    const onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const email = values.email;
        const password = values.password;

        try {
            const user = await register({ email: email, password: password });
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const id = userDoc.data().user_id;
                const email = userDoc.data().email;
                const admin = userDoc.data().admin;

                setAuthState({
                    id: id,
                    email: email,
                    admin: admin,
                    status: true,
                });
                console.log(authState)

                localStorage.setItem("auth", id);
                alert("Usuario registrado");
                navigate("/");
            } else {
                console.error('Error: No se encontró el documento del usuario');
                alert('Error durante el registro');
            }
        } catch (error) {
            alert('Error : ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='addUserPage'>
            {!authState.admin ? (
                <>
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form className='addUserForm form-container mt-5 mx-auto col-3'>
                            <div className="row justify-content-center mx-auto">
                                <div className='mb-3'>
                                    <label htmlFor='inputAddEmail' className='form-label'>
                                        Correo electrónico:
                                    </label>
                                    <Field id='inputAddEmail' name='email' type='email' className='form-control col-8' />
                                    <ErrorMessage name='email' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className="row justify-content-center mx-auto">
                                <div className='mb-3'>
                                    <label htmlFor='inputAddPassword' className='form-label'>
                                        Contraseña:
                                    </label>
                                    <Field id='inputAddPassword' name='password' className='form-control col-8' type="password" />
                                    <ErrorMessage name='password' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className="row justify-content-center mx-auto">
                                <div className='mb-3'>
                                    <label htmlFor='inputAddPasswordCheck' className='form-label'>
                                        Confirmar contraseña:
                                    </label>
                                    <Field id='inputAddPasswordCheck' name='passwordCheck' className='form-control col-8' type="password" />
                                    <ErrorMessage name='passwordCheck' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <button type='submit' className='btn btn-primary col-6'>
                                    Registrarse
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </>
            ) : (
                <div className='d-flex flex-column'>
                    <h1 className='mx-auto mt-4'>Ya estás conectado</h1>
                    <h3 className='mx-auto mt-4'><Link to="/">Inicio</Link></h3>
                </div>
            )}
        </div>
    );
}

export default Register;