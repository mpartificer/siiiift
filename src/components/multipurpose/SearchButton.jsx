import '../../App.css'

function SearchButton(props) {
    const buttonValue = props;
    return (
      <button className='searchResultButton'>{props.buttonValue}</button>
    )
  }

export default SearchButton