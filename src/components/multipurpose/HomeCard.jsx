import { Heart, MessageCircle, History, Croissant } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import PageTitle from './PageTitle.jsx';
import '../../App.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://iivozawppltyhsrkixlk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpdm96YXdwcGx0eWhzcmtpeGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODA3NDQsImV4cCI6MjA0MTY1Njc0NH0.aXIL8StA101tfblFh9yViIlXzwMHNjeoFfeiGu8fXGE')


function PostReactionBox(props) {
    const navigate = useNavigate();
  
    return (
    <div className='postReactionBox mt-1'>
      <Heart size={40} color='#496354'/>
      <MessageCircle size={40} color='#496354'/>
      <History size={40} color='#496354' onClick={() => navigate(`/${props.username}/${props.recipeId}`)}/>
    </div>
    )
}
  
  
function HomeCard() {

    const [bakeDetails, setBakeDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

  
    useEffect(() => {
      let isMounted = true;
  
      async function fetchBakeDetails() {
        try {
          const { data, error } = await supabase
            .from('bake_details_view')
            .select('*');
  
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

    const username = bakeDetails[0].username.toString();
    const recipeTitle = bakeDetails[0].recipe_title;
    const photos = bakeDetails[0].photos.toString();
    const recipeId = bakeDetails[0].recipe_id.toString();
    const userId = bakeDetails[0].user_id.toString();

      return (
        <div className='homeCard'>
          <PageTitle pageTitle={[username, recipeTitle]} path={[`/profile/${username}`, `/recipe/${recipeId}`]} userId={userId} recipeId = {recipeId}/>
          {photos &&<img 
                src={photos}
                alt="recipe" className='recipeImg'
                />}
          <PostReactionBox username={username} recipeId={recipeId} />
        </div>
      )
  }

  export default HomeCard;