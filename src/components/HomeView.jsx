import '../App.css';
import Header from './multipurpose/Header.jsx';
import PageTitle from './multipurpose/PageTitle.jsx';
import { Croissant } from 'lucide-react';
import { Heart } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { History } from 'lucide-react';
import Footer from './multipurpose/Footer.jsx';
import { useNavigate } from 'react-router-dom';


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

function HomeView() {
  return (
    <div>
      <Header />
      <HomeCard />
      <HomeCard />
      <HomeCard />
      <Footer />
    </div>
  )
}

export default HomeView;