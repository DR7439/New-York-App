import { useLocation, useNavigate } from "react-router-dom";

export function Logo() {
  let { pathname } = useLocation();
  const isOnboarding = pathname.includes("onboarding");
  const navigate = useNavigate();
  let handleClick = () => {
    if (!isOnboarding) {
      navigate("/");
    }
  };

  return (
    <div className="text-2xl font-medium cursor-pointer" onClick={handleClick}>
      Ad Optima
    </div>
  );
}
