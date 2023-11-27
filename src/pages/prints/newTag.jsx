import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import { useAddTag } from "../../hooks/useAddTag"

export const NewTag = ({ authState }) => {
    const { addTag } = useAddTag();

    const initialValues = {
        tag_name: ''
    };

    const validationSchema = Yup.object().shape({
        tag_name: Yup.string().min(2, "Minimo de caracteres: 20").max(20, "Maximo de caracteres: 20").required('Introduce el nombre de la etiqueta.'),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        const tag = values.tag_name;
        try {
            addTag({ tag_name: tag });
            alert("Tag añadido");
        } catch (error) {
            console.error('Error al añadir tag:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='addTagPage'>
            {authState.admin ? (
                <>
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form className='addTagForm form-container mt-5 mx-auto col-3'>
                            <div className="row justify-content-center mx-auto">
                                <div className='mb-3'>
                                    <label htmlFor='inputAddTagName' className='form-label'>
                                        Nombre:
                                    </label>
                                    <Field id='inputAddTagName' name='tag_name' className='form-control col-8' placeholder='Ex. SnK...' />
                                    <ErrorMessage name='tag_name' component='p' className='text-danger'></ErrorMessage>
                                </div>
                            </div>
                            <div className='row justify-content-center'>
                                <button type='submit' className='btn btn-primary col-6'>
                                    Añadir etiqueta
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </>
            ) : (
                <div className='d-flex flex-column'>
                    <h1 className='mx-auto mt-4'>Page Not Found</h1>
                    <h3 className='mx-auto mt-4'><Link to="/">Inicio</Link></h3>
                </div>
            )}
        </div>
    )
}

export default NewTag;