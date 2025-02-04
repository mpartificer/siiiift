import React, { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom'
import { supabase } from '../supabaseClient.js';
import '../App.css';
import HeaderFooter from './multipurpose/HeaderFooter.jsx';
import SearchBar from './multipurpose/SearchBar.jsx';
import SearchResult from './multipurpose/SearchResult.jsx';

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
    <div className='searchFilterBar w-350 md:w-96'>
      <SearchFilter 
        filterValue='all' 
        isActive={activeFilter === 'all'} 
        onClick={setActiveFilter} 
      />
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
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let results = [];
      const { data: userData, error: userError } = await supabase
        .from('user_profile')
        .select('user_auth_id, username, photo')
        .ilike('username', `%${searchTerm}%`);

      if (userError) throw userError;
      results = [...results, ...userData.map(user => ({ 
        ...user, 
        type: 'user',
        userId: user.user_auth_id,  // Explicitly include userId
        id: user.user_auth_id  // Maintain id for key prop
      }))];

      const { data: recipeData, error: recipeError } = await supabase
        .from('recipe_profile')
        .select('id, title, images')
        .ilike('title', `%${searchTerm}%`);

      if (recipeError) throw recipeError;
      results = [...results, ...recipeData.map(recipe => ({ 
        ...recipe, 
        type: 'recipe',
        recipeId: recipe.id,  // Explicitly include recipeId
        id: recipe.id  // Maintain id for key prop
      }))];

      setAllSearchResults(results);
      filterResults(results, activeFilter);
    } catch (error) {
      console.error('Error performing search:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterResults = (results, filter) => {
    if (filter === 'all') {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter(result => result.type === filter.slice(0, -1)));
    }
  };

  useEffect(() => {
    filterResults(allSearchResults, activeFilter);
  }, [activeFilter, allSearchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div>
      <HeaderFooter>
        <div className="mt-20 mb-16">
          <div className='flex flex-col w-full items-center gap-4'>
            <form onSubmit={handleSearch}>
              <SearchBar 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </form>
            <SearchFilterBar activeFilter={activeFilter} setActiveFilter={handleFilterChange} />
            {isLoading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="flex flex-col gap-2 md:gap-4">
              {filteredResults.map((result) => (
                <SearchResult 
                  key={result.id}
                  id={result.id}
                  currentUserId={currentUserId}
                  searchReturnValue={result.type === 'user' ? result.username : result.title}
                  imageUrl={result.type === 'user' ? result.photo : result.images?.[0]}
                  type={result.type}
                  userId={result.userId}
                  recipeId={result.recipeId}
                />
              ))}
            </div>
          </div>
        </div>
      </HeaderFooter>
    </div>
  );
}

export default SearchView;