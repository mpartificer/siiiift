import '../App.css';
import HomeCardMobile from './multipurpose/HomeCardMobile.jsx';
import HomeCardDesktop from './multipurpose/HomeCardDesktop.jsx'
import HeaderFooter from './multipurpose/HeaderFooter.jsx';
import { supabase } from '../supabaseClient.js';
import { useState, useEffect } from 'react';

function HomeView() {
  const [bakeDetails, setBakeDetails] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isMounted) {
          setCurrentUserId(user.id);
        }

        // Fetch bake details
        const { data, error } = await supabase
          .from('bake_details_view')
          .select('*');

        if (error) throw error;

        if (isMounted) {
          setBakeDetails(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!bakeDetails || bakeDetails.length === 0) return <div>No bakes available</div>;

  return (
    <div>
      <HeaderFooter>
        <div className='mt-20 mb-20 flex flex-col items-center'>
          {bakeDetails.map((bake) => (
            <div key={bake.bake_id}>
              {windowWidth > 768 ? (
                <HomeCardDesktop 
                  bakeId={bake.bake_id}
                  photos={bake.photos}
                  username={bake.username}
                  recipeTitle={bake.recipe_title}
                  path={[`/profile/${bake.username}`, `/recipe/${bake.recipe_id}`]}
                  userId={bake.user_id}
                  currentUserId={currentUserId}
                  recipeId={bake.recipe_id}
                />
              ) : (
                <HomeCardMobile 
                  bakeId={bake.bake_id}
                  photos={bake.photos}
                  username={bake.username}
                  recipeTitle={bake.recipe_title}
                  path={[`/profile/${bake.username}`, `/recipe/${bake.recipe_id}`]}
                  userId={bake.user_id}
                  currentUserId={currentUserId}
                  recipeId={bake.recipe_id}
                />
              )}
            </div>
          ))}
        </div>
      </HeaderFooter>
    </div>
  );
}

export default HomeView;