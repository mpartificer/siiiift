import '../App.css'
import BigSubmitButton from './multipurpose/BigSubmitButton.jsx'
import Header from './multipurpose/Header.jsx'
import { Image } from 'lucide-react'
import Footer from './multipurpose/Footer.jsx'


function ModificationDropDown(props) {
    const propInsert = props.modificationList;
    const myComponentList = propInsert.map((item, index) => (
      <li key={index}><a>{item}</a></li>));
    const modificationType = props.modificationType + ' modifications:';
    return (
      <div className="dropdown profilePlate">
        <PostSettingTitle settingTitle={modificationType} />
        <div tabIndex={0} role="button" className="btn m-1 w-80 bg-secondary modificationDropDown">choose a step to modify</div>
        <ul tabIndex={0} className="dropdown-content menu bg-secondary rounded-box z-[1] w-52 p-2 shadow ">
          {myComponentList}
        </ul>
      </div>
    )
}

function PostSettingTitle(props) {
    return (
     <div className='recipeCheckTitle'>{props.settingTitle}</div>
    )
}
  
function ModificationRating() {
    return (
      <div className='profilePlateTop'>
        <PostSettingTitle settingTitle='rate:' />
        <ModificationRatingSystem />
      </div>
    )
}
  
function ModificationRatingSystem() {
    return (
      <div className="rating">
        <input type="radio" name="rating-1" className="mask mask-star" />
        <input type="radio" name="rating-1" className="mask mask-star" defaultChecked />
        <input type="radio" name="rating-1" className="mask mask-star" />
        <input type="radio" name="rating-1" className="mask mask-star" />
        <input type="radio" name="rating-1" className="mask mask-star" />
      </div>
    )
}
  
function BakePostDate() {
    return (
      <div className='profilePlateTop'>
        <PostSettingTitle settingTitle='date of bake:' />
        <input type="text" placeholder="mo." className='w-1/4 dayMonthDateEntry'/>
        <input type="text" placeholder="day" className='w-1/4 dayMonthDateEntry'/>
        <input type="text" placeholder="year" className='w-1/2 yearDateEntry' />
      </div>
    )
}

function PostYourBakeView() {
    return (
      <div className='websiteRetrievalView'>
        <Header />
        <Image size={300} />
        <ModificationDropDown modificationList={['1/2 cup sugar', 'bake for 45 minutes', 'rest the dough']} modificationType='ingredient'/>
        <input type="text" placeholder="enter your modification" className="input w-80 max-w-xs customModification" />
        <ModificationDropDown modificationList={['1/2 cup sugar', 'bake for 45 minutes', 'rest the dough']} modificationType='instruction'/>
        <input type="text" placeholder="enter your modification" className="input w-80 max-w-xs customModification" />
        <ModificationRating />
        <BakePostDate />
        <BigSubmitButton submitValue='post' path='/' />
        <Footer />
      </div>
    )
}

export default PostYourBakeView