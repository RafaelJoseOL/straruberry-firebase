import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from "../../config/firebase-config";
import { useEditPrint } from "../../hooks/useEditPrint";
// import { useNavigate } from 'react-router-dom';

export const EditPrint = ({ authState }) => {
    // let navigate = useNavigate();
    const { editPrint } = useEditPrint();
    const [listOfPrints, setListOfPrints] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);
    const [selectedPrint, setSelectedPrint] = useState(null);

    useEffect(() => {
        const fetchPrints = async () => {
            try {
                const q = query(collection(db, "prints"));
                const querySnapshot = await getDocs(q);
                const printsData = querySnapshot.docs.map((doc) => {
                    return {
                        print_id: doc.data().print_id,
                        print_name: doc.data().print_name,
                        print_url: doc.data().print_url,
                        print_tags: doc.data().print_tags,
                    };
                });
                console.log(printsData)
                setListOfPrints(printsData);
            } catch (error) {
                console.error('Error al obtener las prints:', error);
            }
        };
        fetchPrints();
    }, []);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const q = query(collection(db, "tags"));
                const querySnapshot = await getDocs(q);
                const tagsData = querySnapshot.docs.map((doc) => {
                    return {
                        tag_id: doc.data().tag_id,
                        tag_name: doc.data().tag_name,
                    };
                });
                setListOfTags(tagsData);
            } catch (error) {
                console.error('Error al obtener las etiquetas:', error);
            }
        };
        fetchTags();
    }, []);

    const updateSelectedPrint = (printData) => {
        const selectedId = printData.target.value;
        const selectedPrint = listOfPrints.find((print) => print.print_id === Number(selectedId));

        setSelectedPrint(selectedPrint);

        if (selectedPrint) {
            initialValues.name = selectedPrint.print_name;
            initialValues.imageURL = selectedPrint.print_url;
            initialValues.tags = selectedPrint.print_tags || [];
        } else {
            initialValues.name = '';
            initialValues.imageURL = '';
            initialValues.tags = [];
        }
    };

    const handleSaveClick = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const print_id = selectedPrint.print_id;
        const print_name = values.name;
        const print_url = values.imageURL;
        const print_tags = values.tags;
        try {
            editPrint({ print_id: print_id, print_name: print_name, print_url: print_url, print_tags: print_tags });
            alert("Print editada");
        } catch (error) {
            console.error('Error al editar print:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const initialValues = {
        name: selectedPrint ? selectedPrint.print_name : '',
        imageURL: selectedPrint ? selectedPrint.print_url : '',
        tags: selectedPrint ? selectedPrint.print_tags || [] : [],
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Introduce el nombre de la impresión.'),
        imageURL: Yup.string().required('Introduce la URL de la imagen.'),
    });

    return (
        <div>
            {authState.status ? (
                <>
                    <div className='printsSelect d-flex justify-content-center mt-4'>
                        <label htmlFor="printSelect" className='mx-3'>Selecciona una lámina:</label>
                        <select id="printSelect" onChange={(e) => updateSelectedPrint(e)}>
                            <option value="">Elige una</option>
                            {listOfPrints.sort((a, b) => a.print_id - b.print_id).map((print) => (
                                <option key={print.print_id} value={print.print_id}>
                                    {`${print.print_id} - ${print.print_name}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedPrint && (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => handleSaveClick(values, { setSubmitting })}
                            enableReinitialize
                        >
                            <Form className='form-container printDetails d-flex flex-column justify-content-center mt-4 mx-auto'>
                                <div className='row mt-3 mx-auto'>
                                    <label htmlFor="nameInput" className='form-label text-center'>Nombre</label>
                                    <Field type="text" id="nameInput" name="name" className="form-control" />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>
                                <div className='row mt-3 mx-auto'>
                                    <label htmlFor="imageURLInput" className='form-label text-center'>URL de la imagen</label>
                                    <Field type="text" id="imageURLInput" name="imageURL" className="form-control" />
                                    <ErrorMessage name="imageURL" component="div" className="error" />
                                </div>
                                <div className='row mt-3 mx-auto'>
                                    <label className='form-label'>Tags de la lámina:</label>
                                    <div id='checkbox-group-default' className='d-flex flex-wrap mt-3'>
                                        <div className='mx-auto defaultTags'>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Stock A4"} className='form-check-input' />
                                                <label className='form-check-label'>{"Stock A4"}</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Stock A5"} className='form-check-input' />
                                                <label className='form-check-label'>{"Stock A5"}</label>
                                            </div>
                                            <div className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={"Twitch"} className='form-check-input' />
                                                <label className='form-check-label'>{"Twitch"}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div id='checkbox-group' className='d-flex flex-wrap mt-3'>
                                        {listOfTags.sort((a, b) => a.tag_name.localeCompare(b.tag_name)).map((tag) => (
                                            <div key={tag.tag_id} className='form-check form-check-inline'>
                                                <Field type='checkbox' name='tags' value={tag.tag_name} className='form-check-input' />
                                                <label className='form-check-label'>{tag.tag_name}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name='tags' component='p' className='text-danger'></ErrorMessage>
                                </div>
                                <div className='mt-3 mx-auto'>
                                    <button type="submit">Guardar</button>
                                </div>
                            </Form>
                        </Formik>
                    )}
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

export default EditPrint;