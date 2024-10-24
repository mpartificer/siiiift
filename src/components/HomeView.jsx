import '../App.css';
import HomeCard from './multipurpose/HomeCard.jsx';
import HeaderFooter from './multipurpose/HeaderFooter.jsx';
import { supabase } from '../supabaseClient.js';
import { useState, useEffect } from 'react';

function HomeView() {
  const [bakeDetails, setBakeDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let isMounted = true;

    async function fetchBakeDetails() {
      try {
        const { data, error } = await supabase
          .from('bake_details_view')
          .select('*');
          supabase.auth.getUser()

          console.log(data)

        if (error) throw error;

        if (isMounted) {
          setBakeDetails(data);
          setIsLoading(false);
          console.log(data)
        }
      } catch (error) {
        console.error('Error fetching Bake_Details:', error);
        if (isMounted) setIsLoading(false);
      }
    }

  fetchBakeDetails();

    return () => {
      isMounted = false;
    };

  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!bakeDetails || bakeDetails.length === 0) return <div>No user details available</div>;

  console.log(bakeDetails)

  const username = bakeDetails[0].username.toString();
  const recipeTitle = bakeDetails[0].recipe_title;
  const photos = bakeDetails[0].photos.toString();
  const recipeId = bakeDetails[0].recipe_id.toString();
  const userId = bakeDetails[0].user_id.toString();
  const bakeId = bakeDetails[0].bake_id.toString();
  const currentUserId = bakeDetails[1].user_id.toString();

  console.log(recipeId)


  return (
    <div>
      <HeaderFooter>
      <div className='mt-16'>
      <HomeCard bakeId={bakeId} photos={photos} pageTitle={[username, recipeTitle]} path={[`/profile/${username}`, `/recipe/${recipeId}`]} userId={userId} currentUserId={currentUserId} recipeId = {recipeId}/>
      </div>
      </HeaderFooter>
    </div>
  )
}

export default HomeView;