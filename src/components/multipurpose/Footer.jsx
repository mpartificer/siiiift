import { House, Search, Plus, BookOpen, User } from 'lucide-react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient.js'

function Footer() {
  const navigate = useNavigate();

  const [userAuthDetails, setUserAuthDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchUserDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (isMounted && user) {
          setUserAuthDetails(user);

          const { data: userPlus, error } = await supabase
            .from('user_profile')
            .select('*')
            .eq('user_auth_id', user.id)
            .single();

          if (error) throw error;

          if (isMounted) {
            setUserDetails(userPlus);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user_profile:', error);
        if (isMounted) setIsLoading(false);
      }
    }

    fetchUserDetails();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!userDetails) return <div>No user details available</div>;

  const userName = userDetails.username;
  const userId = userDetails.user_auth_id;

  const userData = { "userName": userName, "userId": userId }

  const toUserProfile = () => {
    navigate(`/profile/${userName}`, { state: userData })
  }

  const toUserRecipeBox = () => {
    navigate('/recipebox', { state: userData })
  }

  const toSearch = () => {
    navigate('/search', {state: userData})
  }

  return (
    <div className="btm-nav footerBackground z-50">
      <button className='navIcons' onClick={() => navigate('/')}>
        <House size={36} color="#FAE2D5" />
      </button>
      <button className='navIcons' onClick={toSearch}>
        <Search size={36} color="#FAE2D5" />
      </button>
      <button className='navIcons' onClick={() => navigate('/postyourbake')}>
        <Plus size={36} color="#FAE2D5" />
      </button>
      <button className='navIcons' onClick={toUserRecipeBox}>
        <BookOpen size={36} color="#FAE2D5" />
      </button>
      <button className='navIcons' onClick={toUserProfile}>
        <User size={36} color="#FAE2D5" />
      </button>
    </div>
  )
}

export default Footer;