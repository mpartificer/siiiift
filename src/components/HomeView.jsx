import '../App.css';
import Header from './multipurpose/Header.jsx';
import HomeCard from './multipurpose/HomeCard.jsx';
import Footer from './multipurpose/Footer.jsx';
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react';

const supabase = createClient("https://iivozawppltyhsrkixlk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpdm96YXdwcGx0eWhzcmtpeGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODA3NDQsImV4cCI6MjA0MTY1Njc0NH0.aXIL8StA101tfblFh9yViIlXzwMHNjeoFfeiGu8fXGE')

function HomeView() {

  const [recipeModifications, setRecipeModifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let isMounted = true;

    async function fetchRecipeModifications() {
      try {
      const { data, error } = await supabase
        .from('Recipe_Modifications')
        .select('*');

        if (error) throw error;

        if (isMounted) {
          setRecipeModifications(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Recipe_Modifications:', error);
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRecipeModifications();

    return () => {
      isMounted = false;
  };}, []);

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <Header />
      <HomeCard />
      <Footer />
    </div>
  )
}

export default HomeView;