import '../../App.css';

function LogInEntry(props) {
    const entryValue = props;
    return (
      <input type="text" placeholder={props.entryValue} className="loginBar"/>
    )
}

export default LogInEntry;