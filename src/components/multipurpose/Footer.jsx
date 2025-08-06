import { House, Search, Plus, BookOpen, User } from "lucide-react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

function Footer() {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  if (!userDetails) {
    return (
      <div className="btm-nav footerBackground z-50">
        <button className="navIcons" onClick={() => navigate("/")}>
          <House size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons" onClick={() => navigate("/search")}>
          <Search size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons" onClick={() => navigate("/postyourbake")}>
          <Plus size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons">
          <BookOpen size={36} color="#FAE2D5" />
        </button>
        <button className="navIcons">
          <User size={36} color="#FAE2D5" />
        </button>
      </div>
    );
  }

  const userName = userDetails.username;
  const userId = userDetails.user_auth_id;
  const userData = { userName, userId };

  const toUserProfile = () => {
    navigate(`/profile/${userName}`, { state: userData });
  };

  const toUserRecipeBox = () => {
    navigate("/recipebox", { state: userData });
  };

  const toSearch = () => {
    navigate("/search", { state: userData });
  };

  return (
    <div className="btm-nav footerBackground z-50">
      <button className="navIcons" onClick={() => navigate("/")}>
        <House size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={toSearch}>
        <Search size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={() => navigate("/postyourbake")}>
        <Plus size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={toUserRecipeBox}>
        <BookOpen size={36} color="#FAE2D5" />
      </button>
      <button className="navIcons" onClick={toUserProfile}>
        <User size={36} color="#FAE2D5" />
      </button>
    </div>
  );
}

export default Footer;
