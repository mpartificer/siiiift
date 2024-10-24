import Footer from './Footer.jsx'
import Header from './Header.jsx'

export default function HeaderFooter(props) {
    return (
        <div className='w-screen'>
        <Header />
            {props.children}
        <Footer />
        </div>
    )
}