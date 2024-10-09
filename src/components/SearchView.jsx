import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import '../App.css';
import Header from './multipurpose/Header.jsx';
import SearchBar from './multipurpose/SearchBar.jsx';
import SearchResult from './multipurpose/SearchResult.jsx';
import Footer from './multipurpose/Footer.jsx';

function SearchFilter({ filterValue, isActive, onClick }) {
  return (
    <button 
      className={`searchFilter ${isActive ? 'bg-secondary text-primary' : 'bg-primary text-secondary'}`}
      onClick={() => onClick(filterValue)}
    >
      {filterValue}
    </button>
  );
}

function SearchFilterBar({ activeFilter, setActiveFilter }) {
  return (
    <div className='searchFilterBar'>
      <SearchFilter 
        filterValue='users' 
        isActive={activeFilter === 'users'} 
        onClick={setActiveFilter} 
      />
      <SearchFilter 
        filterValue='recipes' 
        isActive={activeFilter === 'recipes'} 
        onClick={setActiveFilter} 
      />
    </div>
  );
}

function SearchView() {

  const location = useLocation();
  const currentUserId = location.state.userId;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let results = [];
      if (activeFilter === 'users' || activeFilter === 'all') {
        const { data: userData, error: userError } = await supabase
          .from('user_profile')
          .select('user_auth_id, username')
          .ilike('username', `%${searchTerm}%`);

        if (userError) throw userError;
        results = [...results, ...userData.map(user => ({ ...user, type: 'user' }))];
      }

      if (activeFilter === 'recipes' || activeFilter === 'all') {
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipe_profile')
          .select('id, title')
          .ilike('title', `%${searchTerm}%`);

        if (recipeError) throw recipeError;
        results = [...results, ...recipeData.map(recipe => ({ ...recipe, type: 'recipe' }))];
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='followersView'>
      <Header />
      <form onSubmit={handleSearch}>
        <SearchBar 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </form>
      <SearchFilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {searchResults.map((result) => (
      <SearchResult 
        key={result.type === 'user' ? result.user_auth_id : result.id}
        id={result.type === 'user' ? result.user_auth_id : result.id}
        currentUserId={currentUserId} // Make sure to pass this from the parent component
        searchReturnValue={result.type === 'user' ? result.username : result.title}
        type={result.type}
      />
      ))}
      <Footer />
    </div>
  );
}

export default SearchView;