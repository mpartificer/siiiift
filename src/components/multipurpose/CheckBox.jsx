import '../../App.css'

function CheckBox(props) {
    return (
      <div className="form-control bottomPanel">
        <label className="cursor-pointer label">
          <span>confirm {props.confirmRecipeItem}?</span>
          <input type="checkbox" className="checkbox checkbox-success" />
        </label>
      </div>
    )
  }

  export default CheckBox