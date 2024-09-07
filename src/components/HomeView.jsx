import '../App.css';
import Header from './multipurpose/Header.jsx';
import PageTitle from './multipurpose/PageTitle.jsx';
import { Croissant } from 'lucide-react';
import { Heart } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { History } from 'lucide-react';

function PostReactionBox() {
    return (
      <div className='postReactionBox'>
        <Heart size={40} color='#192F01'/>
        <MessageCircle size={40} color='#192F01'/>
        <History size={40} color='#192F01'/>
      </div>
    )
}


function HomeView() {
    return (
      <div className='homeCard'>
        <Header />
        <PageTitle pageTitle='username made cupcakes' />
        <Croissant size={350} />
        <PostReactionBox />
      </div>
    )
}

export default HomeView;