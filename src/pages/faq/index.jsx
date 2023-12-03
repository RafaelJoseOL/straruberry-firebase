import React from 'react'

export const Faq = () => {
    return (
        <div>
            <div className='faq1div ms-5 mt-4 col-6'>
                <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" aria-expanded="false" aria-controls="faq1">
                    ¿Que funcionalidades tiene la página?
                </button>
                <div className="collapse text-align-center mt-3" id="faq1">
                    Puedes filtrar mediante los tags o el nombre de las distintas prints hechas por Straruberry,
                    permitiéndote así encontrar una concreta de manera cómoda. Además, puedes comprobar cuáles de
                    ellas eran limitadas, o hechas en su canal de Twitch. Por último, si te registras, podrás
                    guardar las prints que quieres o las que tienes, para mayor comodidad, mediante los botones del
                    corazón y el marcador.
                </div>
            </div>
            <div className='faq2div ms-5 mt-4 col-6'>
                <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" aria-expanded="false" aria-controls="faq2">
                    Placeholder
                </button>
                <div className="collapse text-align-center mt-3" id="faq2">
                    Placeholder
                </div>
            </div>
            <div className='faq3div ms-5 mt-4 col-6'>
                <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" aria-expanded="false" aria-controls="faq3">
                    Placeholder
                </button>
                <div className="collapse text-align-center mt-3" id="faq3">
                    Placeholder
                </div>
            </div>
        </div>
    )
}

export default Faq;