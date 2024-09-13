import '../App.css';
import Header from './multipurpose/Header.jsx';
import HomeCard from './multipurpose/HomeCard.jsx';
import Footer from './multipurpose/Footer.jsx';





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