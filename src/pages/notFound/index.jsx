import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className='d-flex flex-column'>
            <h1 className='mx-auto mt-4'>Página no encontrada</h1>
            <h3 className='mx-auto mt-4'><Link to="/">Inicio</Link></h3>            
        </div>
    )
}

export default NotFound;