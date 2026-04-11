import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="">
      <button onClick={onToggle} className="">
        {avatar ? (
          <img src={avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            {companyName ? companyName.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <div className="">
          <p className="">{companyName}</p>
          <p className="">{email}</p>
        </div>
        <ChevronDown className="" />
      </button>

      {isOpen && (
        <div className="">
          <div>
            <p className="">{companyName}</p>
            <p className="">{email}</p>
          </div>

          <a
            onClick={() => navigate("/profile")}
            className=""
          >
            Profile
          </a>
          <a
            onClick={onLogout}
            className=""
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;