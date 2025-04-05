import React, { useState, useEffect } from 'react';
import './App.css';
function App() {
  const [emotion, setEmotion] = useState('');
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const emotions = ['happy', 'sad', 'angry', 'relaxed', 'motivated'];
  const usedBookKeys = new Set(); // To track used book keys

useEffect(() => {
    const fetchBooks = async (query) => {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
        );
        const data = await response.json();
        const filteredBooks = data.docs.filter((book) => {
          // Filter out books that have already been used
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
        setEmotion(' '); // Clear emotion if search
      }
  }, [emotion, searchTerm]);
// Function to fetch books based on the selected emotion
  const handleEmotionClick = (selectedEmotion) => { 
    setEmotion(selectedEmotion);
    setSearchTerm (''); //clear search when emotion is selected
  };
  const handleSearch = () => {
    if (searchTerm){
      setEmotion('')//clear emotion button when searching
    }
  };

  return (
    <div className="App">
      <h1>Book Suggestions</h1>
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