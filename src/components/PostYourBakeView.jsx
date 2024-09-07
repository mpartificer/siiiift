import '../App.css'
import BigSubmitButton from './multipurpose/BigSubmitButton.jsx'
import Header from './multipurpose/Header.jsx'
import { Image } from 'lucide-react'


function ModificationDropDown(props) {
    const propInsert = props.modificationList;
    const myComponentList = propInsert.map((item, index) => (
      <li key={index}>{item}</li>));
    return (
      <div className="dropdown profilePlate">
        <PostSettingTitle settingTitle='modifications:' />
        <div tabIndex={0} role="button" className="btn m-1 w-80 modificationDropDown">choose a step to modify</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow modificationDropDown ">
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
        <ModificationDropDown modificationList={['1/2 cup sugar', 'bake for 45 minutes', 'rest the dough']} />
        <input type="text" placeholder="enter your modification" className="input w-80 max-w-xs customModification" />
        <ModificationRating />
        <BakePostDate />
        <BigSubmitButton submitValue='post'/>
      </div>
    )
  }

  export default PostYourBakeView