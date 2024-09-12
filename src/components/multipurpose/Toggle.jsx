import '../../App.css'

function Toggle(props) {
    return (
    <div className="">
      {/* <label className={`label cursor-pointer ${props.justify}`}> */}
      {/* <label className={` cursor-pointer`}> */}

        <input type="checkbox" className="toggle toggle-accent" defaultChecked />
      {/* </label> */}
    </div>
    )
  }

  export default Toggle