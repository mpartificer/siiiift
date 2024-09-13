import { Heart, MessageCircle, History, Croissant } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import PageTitle from './PageTitle.jsx';
import '../../App.css';

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
      return (
        <div className='homeCard'>
          <PageTitle pageTitle={['username', 'cupcakes']} path={['/profile', '/recipeid']} />
          <Croissant size={350} />
          <PostReactionBox />
        </div>
      )
  }

  export default HomeCard;