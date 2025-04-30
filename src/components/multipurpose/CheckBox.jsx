import "../../App.css";

function CheckBox(props) {
  return (
    <div className="form-control bottomPanel">
      <label className="cursor-pointer label font-semibold">
        <span>confirm {props.confirmRecipeItem}?</span>
        <input
          type="checkbox"
          className="checkbox checkbox-accent border-width-2 border-primary"
        />
      </label>
    </div>
  );
}

export default CheckBox;
