import { House, Search, Plus, BookOpen, User } from 'lucide-react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

    return(
      <>
        <div className="btm-nav footerBackground">
          <button className='navIcons' onClick={() => navigate('/')}>
            <House size={36} color="#FAE2D5" />
          </button>
          <button className='navIcons' onClick={() => navigate('/search')}>
            <Search size={36} color="#FAE2D5"/>
          </button>
          <button className='navIcons' onClick={() => navigate('/postyourbake')}>
            <Plus size={36} color="#FAE2D5"/>
          </button>
          <button className='navIcons' onClick={() => navigate('/recipebox')}>
            <BookOpen size={36} color="#FAE2D5"/>
          </button>
          <button className='navIcons' onClick={() => navigate('/profile')}>
            <User size={36} color="#FAE2D5"/>
          </button>
        </div>
      </>
    )
}

export default Footer;