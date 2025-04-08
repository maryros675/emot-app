import React, { useState, useEffect } from 'react';
import './App.css';

// The code is a React application that allows users to find books based on their emotions or search terms.
// It fetches book data from the Open Library API and displays the results in a user-friendly interface.

function App() {
  const [emotion, setEmotion] = useState(''); 
  const [books, setBooks] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const emotions = ['happy', 'sad', 'angry', 'relaxed', 'motivated']; 
  const usedBookKeys = new Set(); 

useEffect(() => { 
    const fetchBooks = async (query) => { 
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
        );
        const data = await response.json(); 
        const filteredBooks = data.docs.filter((book) => {
          
          if (usedBookKeys.has(book.key)) return false; 
          usedBookKeys.add(book.key); 
          return true;
        });
        setBooks(filteredBooks); 
      } catch (error) { 
        console.error('Error fetching books:', error);
      }
    }
    if (emotion) { 
      fetchBooks(emotion);
    } 
    else if (searchTerm) { 
        fetchBooks(searchTerm);
        setEmotion(' '); 
      }
  }, [emotion, searchTerm]); 

  const handleEmotionClick = (selectedEmotion) => { 
    setEmotion(selectedEmotion); 
    setSearchTerm (''); 
  };
  const handleSearch = () => {
    if (searchTerm){ 
      setEmotion('')
    }
  };

  return ( 
    <div className="App"> 
      <h1>EmotiReads</h1> 
      <h3>Find a book based on your mood!</h3>
      <div className="emotions">
        {emotions.map((e) => ( 
          <button
            key={e} 
            onClick={() => handleEmotionClick(e)} 
            className={emotion === e ? 'selected' : ''}  
          >
            {e} 
          </button>
        ))}
      </div>
      {emotion && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Book" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button onClick={handleSearch}>Search</button> 
        </div>
      )}
      <div className="books">
        {books.map((book) => (
          <div key={book.key} className="book">
            <img
              src={`http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={`${book.title} cover`}
            />
            <h2>{book.title}</h2>
            <p>Author: {book.author_name.join(', ')}</p>
            <p>Year: {book.first_publish_year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
