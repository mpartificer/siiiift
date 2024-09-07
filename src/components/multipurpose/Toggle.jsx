import '../../App.css'

function Toggle(props) {
    return (
    <div className="form-control w-52">
      <label className={`label cursor-pointer ${props.justify}`}>
        <input type="checkbox" className="toggle toggle-accent" defaultChecked />
      </label>
    </div>
    )
  }

  export default Toggle