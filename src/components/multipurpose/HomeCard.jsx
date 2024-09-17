import { Heart, MessageCircle, History, Croissant } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import PageTitle from './PageTitle.jsx';
import '../../App.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://iivozawppltyhsrkixlk.supabase.co", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpdm96YXdwcGx0eWhzcmtpeGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYwODA3NDQsImV4cCI6MjA0MTY1Njc0NH0.aXIL8StA101tfblFh9yViIlXzwMHNjeoFfeiGu8fXGE')


function PostReactionBox() {
    const navigate = useNavigate();
  
      return (
        <div className='postReactionBox'>
          <Heart size={40} color='#192F01'/>
          <MessageCircle size={40} color='#192F01'/>
          <History size={40} color='#192F01' onClick={() => navigate('/userid/recipeid')}/>
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
            .from('Bake_Details')
            .select('*');
  
          if (error) throw error;
  
          if (isMounted) {
            setBakeDetails(data);
            setIsLoading(false);
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

    if (!bakeDetails || bakeDetails.length === 0) return <div>No bake details available</div>;


    console.log(bakeDetails);
      return (
        <div className='homeCard'>
          <PageTitle pageTitle={[bakeDetails[0].user_id, bakeDetails[0].recipe_id]} path={['/profile', '/recipeid']} />
          <img 
                src={bakeDetails[0].photos[0]}
                alt="new" className='recipeImg'
                />
          <PostReactionBox />
        </div>
      )
  }

  export default HomeCard;