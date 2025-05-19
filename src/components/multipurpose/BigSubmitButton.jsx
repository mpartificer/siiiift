import "../../App.css";
import { useNavigate } from "react-router-dom";

function BigSubmitButton(props) {
  const { path, onClick, submitValue, disabled } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) {
      return;
    }

    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <button
      className={`bigSubmitButton ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {submitValue}
    </button>
  );
}

export default BigSubmitButton;
