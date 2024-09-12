import '../App.css';
import Header from './multipurpose/Header.jsx';
import Footer from './multipurpose/Footer.jsx';
import { Heart } from 'lucide-react';
import PageTitle from './multipurpose/PageTitle.jsx';
function DateMarker() {
    return (
        <div className="bg-primary text-primary-content overflow-hidden standardBorder w-fit pt-1 pb-1 pr-4 pl-4">
            september 2024
        </div>
    )
}

function BakeDetailInsert(props) {
    return (
        <div>
            <h2 className='font-bold'>{props.Title}</h2>
            <p>{props.Description}</p>
        </div>
    )
}


function BakeHistoryCard() {
    return (
        <div className='recipeCheckPanel flex flex-col gap-2 bg-accent p-2'>
            <DateMarker />
            <img src='/src/assets/TempImage.jpg' alt='recipe image' className='recipeImg self-center' />
            <Heart />
            <BakeDetailInsert Title='modification' Description='added sugar' />
            <BakeDetailInsert Title='ai insight' Description='looks dry loser' />
        </div>
    )
}

function BakeHistoryView() {
    return (
        <div className='followersView'>
            <Header />
            <PageTitle pageTitle='usernames recipe title bake history' />
            <BakeHistoryCard />
            <Footer />
        </div>
    )
}

export default BakeHistoryView;
