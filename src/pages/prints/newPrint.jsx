import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from "../../config/firebase-config";
import { useAddPrint } from "../../hooks/useAddPrint"

export const NewPrint = ({ authState }) => {
    const [availableTags, setAvailableTags] = useState([]);
    const { addPrint } = useAddPrint();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const q = query(collection(db, "tags"));
                const querySnapshot = await getDocs(q);
                const tagsData = querySnapshot.docs.map((doc) => doc.data().tag_name);
                setAvailableTags(tagsData);
                console.log(tagsData);
            } catch (error) {
                console.error('Error al obtener las etiquetas:', error);
            }
        };

        fetchTags();
    }, []);

    const initialValues = {
        name: '',
        imageURL: '',
        tags: [],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3).max(50).required('Introduce el nombre de la lámina.'),
        imageURL: Yup.string().required('Introduce una URL correcta.'),
        tags: Yup.array().min(1, 'Selecciona al menos una etiqueta.').of(Yup.string().required()).required(),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const print_name = values.name;
        const print_url = values.imageURL;
        const print_tags = values.tags;
        console.log(values);
        try {
            addPrint({ print_name: print_name, print_url: print_url, print_tags: print_tags });
            alert("Print añadida");
        } catch (error) {
            console.error('Error al añadir print:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='addPrintPage'>
            {authState.admin ? (
                <>
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form className='form-container addPrintForm mt-5 mx-auto col-10 col-md-3'>
                            <div className="row justify-content-center mx-auto">
                                <div className='mb-3'>
                                    <label htmlFor='inputAddPrintName' className='form-label'>
                                        Nombre:
                                    </label>
                                    <Field id='inputAddPrintName' name='name' className='form-control col-8' placeholder='Ex. Mikasa...' />
                                    <ErrorMessage name='name' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center mx-auto'>
                                <div className='mb-3'>
                                    <label htmlFor='inputAddPrintURL' className='form-label'>
                                        URL de la imagen:
                                    </label>
                                    <Field id='inputAddPrintURL' name='imageURL' className='form-control' />
                                    <ErrorMessage name='imageURL' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center mx-auto'>
                                <div className='mb-3'>
                                    <label className='form-label d-flex justify-content-center'>Tags de la lámina:</label>
                                    <div id='checkbox-group' className='d-flex flex-wrap'>
                                        <div className='mx-auto defaultTags'>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Especial"} className='form-check-input' />
                                                <label className='form-check-label'>{"Especial"}</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Twitch"} className='form-check-input' />
                                                <label className='form-check-label'>{"Twitch"}</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Stock A4"} className='form-check-input' />
                                                <label className='form-check-label'>{"Stock A4"}</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Stock A5"} className='form-check-input' />
                                                <label className='form-check-label'>{"Stock A5"}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div id='checkbox-group' className='d-flex flex-wrap mt-3'>
                                        {availableTags.sort((a, b) => a.localeCompare(b)).map((tag, index) => (
                                            <div key={index} className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={tag} className='form-check-input' />
                                                <label className='form-check-label'>{tag}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name='tags' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <button type='submit' className='btn btn-primary col-6'>
                                    Añadir print
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
    )
}

export default NewPrint;