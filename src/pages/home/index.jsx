import { useState, useEffect } from 'react';
import { collection, getDocs, query, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/firebase-config";

export const Home = ({ authState }) => {
    const defaultTags = ["Quiero", "Tengo", "Especial", "Twitch", "Stock A4", "Stock A5"];
    const [listOfPrints, setListOfPrints] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Alfabetico');
    const [showOwnedOnly, setShowOwnedOnly] = useState(false);
    const [showWantedOnly, setShowWantedOnly] = useState(false);
    const [printsOwned, setPrintsOwned] = useState([]);
    const [printsWanted, setPrintsWanted] = useState([]);

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
                const tagsData = querySnapshot.docs.map((doc) => doc.data().tag_name);
                setListOfTags(tagsData);
            } catch (error) {
                console.error('Error al obtener las etiquetas:', error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchPrints = async () => {
            try {
                if (authState && authState.id) {
                    const userDocRef = doc(db, 'users', authState.id);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const owned = userDocSnap.data().printsOwned || [];
                        const wanted = userDocSnap.data().printsWanted || [];
                        setPrintsOwned(owned);
                        setPrintsWanted(wanted);
                    }
                }
            } catch (error) {
                console.error('Error al obtener las prints:', error);
            }
        };

        fetchPrints();
    }, [authState]);

    // useEffect(() => {
    //     console.log(listOfPrints);
    //   }, [listOfPrints]);

    //   useEffect(() => {
    //     console.log(listOfTags);
    //   }, [listOfTags]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleTagClick = (tag) => {
        if (tag === 'Tengo') {
            setShowOwnedOnly(!showOwnedOnly);
        } else if (tag === 'Quiero') {
            setShowWantedOnly(!showWantedOnly);
        } else {
            if (selectedTags.includes(tag)) {
                setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
            } else {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

    const sortedPrints = () => {
        switch (sortOption) {
            case 'Alfabetico':
                return listOfPrints.sort((a, b) => a.print_name.localeCompare(b.print_name));
            case 'AlfabeticoInverso':
                return listOfPrints.sort((a, b) => b.print_name.localeCompare(a.print_name));
            default:
                return listOfPrints;
        }
    };

    const filteredPrints = sortedPrints().filter((print) => {
        const tengoMatch = showOwnedOnly ? printsOwned.includes(print.print_id) : true;
        const quieroMatch = showWantedOnly ? printsWanted.includes(print.print_id) : true;
        const tagsMatch = selectedTags.length === 0 || selectedTags.every((selectedTag) => print.print_tags.includes(selectedTag));
        const nameMatch = print.print_name.toLowerCase().includes(searchTerm.toLowerCase());

        return tengoMatch && quieroMatch && tagsMatch && nameMatch;
    });

    const handlePrintOwnership = async (printId) => {
        try {
            if (authState && authState.id) {
                const userDocRef = doc(db, 'users', authState.id);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const updatedOwnedPrints = printsOwned.includes(printId)
                        ? printsOwned.filter((id) => id !== printId)
                        : [...printsOwned, printId];

                    setPrintsOwned(updatedOwnedPrints);

                    await updateDoc(userDocRef, { printsOwned: updatedOwnedPrints });

                    console.log('Base de datos actualizada correctamente');
                }
            }
        } catch (error) {
            console.error('Error al actualizar la base de datos:', error);
        }
    };

    const handlePrintWanted = async (printId) => {
        try {
            if (authState && authState.id) {
                const userDocRef = doc(db, 'users', authState.id);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const updatedWantedPrints = printsWanted.includes(printId)
                        ? printsWanted.filter((id) => id !== printId)
                        : [...printsWanted, printId];

                    setPrintsWanted(updatedWantedPrints);

                    await updateDoc(userDocRef, { printsWanted: updatedWantedPrints });

                    console.log('Base de datos actualizada correctamente');
                }
            }
        } catch (error) {
            console.error('Error al actualizar la base de datos:', error);
        }
    };


    return (
        <div className='container-fluid mainHome'>
            <div className='row'>
                <div className='d-none d-md-block col-md-2 sideBar text-light d-flex flex-column justify-content-top'>
                    <div className='sortDropdown my-3'>
                        <label htmlFor='sortSelect' className='form-label text-light me-2'>
                            Ordenar por:
                        </label>
                        <select
                            id='sortSelect'
                            className='form-select'
                            value={sortOption}
                            onChange={handleSortChange}
                        >
                            <option value='Alfabetico'>Alfabético</option>
                            <option value='AlfabeticoInverso'>Alfabético Inverso</option>
                        </select>
                    </div>
                    <div className='searchBar mt-3'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Buscar por nombre...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='defaultTagsList my-5'>
                        <ul className='list-group'>
                            {defaultTags.map((value, key) => (
                                <li key={key} className='list-group-item bg-dark text-light'>
                                    <label className='form-check-label'>
                                        <input
                                            type='checkbox'
                                            className='form-check-input me-2'
                                            value={value}
                                            checked={(value === 'Tengo' && showOwnedOnly)
                                                || (value === 'Quiero' && showWantedOnly)
                                                || selectedTags.includes(value)}
                                            onChange={() => handleTagClick(value)}
                                        />
                                        {value}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='tagsList'>
                        <ul className='list-group'>
                            {listOfTags.sort((a, b) => a.localeCompare(b)).map((tag, key) => (
                                <li key={key} className='list-group-item bg-dark text-light'>
                                    <label className='form-check-label'>
                                        <input
                                            type='checkbox'
                                            className='form-check-input me-2'
                                            value={tag}
                                            checked={selectedTags.includes(tag)}
                                            onChange={() => handleTagClick(tag)}
                                        />
                                        {tag}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='d-md-none d-md-block mt-3'>
                    <p className='col-md-12 text-center'>
                        <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                            Búsqueda/Filtro
                        </button>
                    </p>
                    <div className="collapse text-align-center" id="collapseFilter">
                        <div className='sortDropdown my-3'>
                            <label htmlFor='sortSelect' className='form-label text-light me-2'>
                                Ordenar por:
                            </label>
                            <select
                                id='sortSelect'
                                className='form-select'
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value='Alfabetico'>Alfabético</option>
                                <option value='AlfabeticoInverso'>Alfabético Inverso</option>
                            </select>
                        </div>
                        <div className='searchBar mt-3'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Buscar por nombre...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='defaultTagsList my-5'>
                            <ul className='list-group'>
                                {defaultTags.map((value, key) => (
                                    <li key={key} className='list-group-item bg-dark text-light'>
                                        <label className='form-check-label'>
                                            <input
                                                type='checkbox'
                                                className='form-check-input me-2'
                                                value={value}
                                                checked={(value === 'Tengo' && showOwnedOnly)
                                                    || (value === 'Quiero' && showWantedOnly)
                                                    || selectedTags.includes(value)}
                                                onChange={() => handleTagClick(value)}
                                            />
                                            {value}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='tagsList'>
                            <ul className='list-group'>
                                {listOfTags.sort((a, b) => a.localeCompare(b)).map((tag, key) => (
                                    <li key={key} className='list-group-item bg-dark text-light'>
                                        <label className='form-check-label'>
                                            <input
                                                type='checkbox'
                                                className='form-check-input me-2'
                                                value={tag}
                                                checked={selectedTags.includes(tag)}
                                                onChange={() => handleTagClick(tag)}
                                            />
                                            {tag}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='col-10 prints mt-3 mx-auto'>
                    <div className='row'>
                        {filteredPrints.map((print, index) => (
                            <div className='col-6 col-md-4 print mb-4 d-flex flex-column align-items-center' key={index}>
                                <a href={print.print_url} target="_blank" rel="noreferrer noopener">
                                    <img src={print.print_url} alt={print.print_name} className='img-fluid' />
                                </a>
                                <div className='row'>
                                    <div className='col-3 mt-1 print'>
                                        {authState.status && (
                                            <>
                                                <div>
                                                    <label>
                                                        <div className="con-like">
                                                            <input className="like"
                                                                type="checkbox"
                                                                title="like"
                                                                checked={printsWanted.includes(print.print_id)}
                                                                onChange={() => handlePrintWanted(print.print_id)}
                                                            />
                                                            <div className="checkmark">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="outline" viewBox="0 0 24 24">
                                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                                                                </svg>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="filled" viewBox="0 0 24 24">
                                                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                                                                </svg>
                                                                <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" className="celebrate">
                                                                    <polygon className="poly" points="10,10 20,20"></polygon>
                                                                    <polygon className="poly" points="10,50 20,50"></polygon>
                                                                    <polygon className="poly" points="20,80 30,70"></polygon>
                                                                    <polygon className="poly" points="90,10 80,20"></polygon>
                                                                    <polygon className="poly" points="90,50 80,50"></polygon>
                                                                    <polygon className="poly" points="80,80 70,70"></polygon>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className='col-6 print printName text-center align-items-center d-flex flex-column justify-content-center'>
                                        {print.print_name}
                                    </div>
                                    <div className='col-3 mt-1 print'>
                                        {authState.status && (
                                            <>
                                                <div>
                                                    <label className="ui-bookmark">
                                                        <input type="checkbox"
                                                            checked={printsOwned.includes(print.print_id)}
                                                            onChange={() => handlePrintOwnership(print.print_id)}
                                                        />
                                                        <div className="bookmark">
                                                            <svg viewBox="0 0 32 32">
                                                                <g>
                                                                    <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;