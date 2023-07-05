import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const StartupList = () => {
  const [startups, setStartups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalStartup, setModalStartup] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/startups')
      .then((res) => res.json())
      .then((data) => {
        setStartups(data);
        // Extract unique categories from the startups data
        const uniqueCategories = [...new Set(data.map(startup => startup.category))].sort();
        setCategories(uniqueCategories);
      })
      .catch((err) => console.log(err));
  }, []);
  
  function openModal(startup) {
    setModalStartup(startup);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleCategoryChange(e) {
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, e.target.value]);
    } else {
      setSelectedCategories(selectedCategories.filter(category => category !== e.target.value));
    }
  }

  return (
    <>
      <h1 className="headline">
        Startups in Finland, created by{' '}
        <a
          href="https://www.linkedin.com/in/ernesti-sario-010b6a214/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          @Internetrookie
        </a>
      </h1>
      <div className="container1">
        <div className="flex flex-col lg:flex-row">
          <div className="search-container mb-4 lg:mb-0 lg:mr-4 w-full lg:w-auto">
            <input
                type="text"
                placeholder="Search startups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />
          <p>---------------------------------------</p>   
          <p>Categories</p> 
          <a>---------------------------------------</a>
            {categories.map(category => (
                category && category.trim() !== '' && (
                  <div key={category}>
                    <label>
                      <input
                        type="checkbox"
                        value={category}
                        onChange={handleCategoryChange}
                      />
                      {category}
                    </label>
                  </div>
                )
            ))}
          </div>
        </div>   
        <div className='container2'>
          <div className="flex flex-grow justify-center mt-10 lg:overflow-x-auto w-full lg:w-auto">
            <table className="table-auto border-collapse border border-green-800">
              <thead>
                <tr>
                  <th className="border border-green-600 px-4 py-2 text-green-700">ID</th>
                  <th className="border border-green-600 px-4 py-2 text-green-700">Name</th>
                  <th className="border border-green-600 px-4 py-2 text-green-700">Category</th>
                  <th className="border border-green-600 px-4 py-2 text-green-700">Founded</th>
                  <th className="border border-green-600 px-4 py-2 text-green-700">City</th>
                </tr>
              </thead>
              <tbody>
              {startups
                    .filter((startup) => {
                      if (search === "" && selectedCategories.length === 0) {
                        return true;
                      } else if (
                        (search === "" || startup.name.toLowerCase().includes(search.toLowerCase())) &&
                        (selectedCategories.length === 0 || selectedCategories.includes(startup.category))
                      ) {
                        return true;
                      }
                      return false;
                    })
                    .map((startup) => (
                      <tr
                        key={startup.id}
                        onClick={() => openModal(startup)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: hoveredRow === startup.id ? 'lightgray' : '',
                        }}
                        onMouseEnter={() => setHoveredRow(startup.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                    <td className="border border-green-500 px-4 py-2">{startup.id}</td>
                    <td className="border border-green-500 px-4 py-2">{startup.name || "-"}</td>
                    <td className="border border-green-500 px-4 py-2">{startup.category || "-"}</td>
                    <td className="border border-green-500 px-4 py-2">{startup.founded || "-"}</td>
                    <td className="border border-green-500 px-4 py-2">{startup.city || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>  
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Startup Details"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            },
            content: {
              top: '30%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '500px',
              position: 'relative',
              padding: '30px'
            }
          }}
        >
          <div style={{ position: 'relative', height: '100%' }}>
            <h2 style={{ fontWeight: 'bold', fontSize: '1.5em', marginBottom: '20px' }}>{modalStartup.name}</h2>
            <p style={{ border: '2px solid black', padding: '20px', maxHeight: '200px', overflow: 'auto', marginBottom: '30px' }}>{modalStartup.description}</p>
            <a
              href={modalStartup.website}
              style={{
                display: 'inline-block',
                backgroundColor: '#f4f4f4',
                color: '#333',
                padding: '6px 18px',
                borderRadius: '16px',
                position: 'absolute',
                bottom: '10px',
                left: '8px'
              }}
              onMouseOver={e => e.target.style.backgroundColor = '#ddd'}
              onMouseOut={e => e.target.style.backgroundColor = '#f4f4f4'}
            >
              Company website
            </a>
            <button className='close' onClick={closeModal}>x</button>
          </div>
        </Modal>
    </div>    
  </>
  );
};

export default StartupList;
