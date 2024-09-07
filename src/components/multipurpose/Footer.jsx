import { House, Search, Plus, BookOpen, User } from 'lucide-react';
import '../App.css';

function Footer() {
    return(
      <>
        <div className="footer btm-nav">
          <button className='navIcons'>
            <House size={36} color="#FAE2D5" />
          </button>
          <button className='navIcons'>
            <Search size={36} color="#FAE2D5"/>
          </button>
          <button className='navIcons'>
            <Plus size={36} color="#FAE2D5"/>
          </button>
          <button className='navIcons'>
            <BookOpen size={36} color="#FAE2D5"/>
          </button>
          <button className='navIcons'>
            <User size={36} color="#FAE2D5"/>
          </button>
        </div>
      </>
    )
}

export default Footer;