import { createContext, useContext, useState ,useEffect} from "react";
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = Cookies.get("userDetails");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const [userDetails, setUserDetails] = useState(initialUser);

  useEffect(() => {
    if (userDetails) {
      Cookies.set("userDetails", JSON.stringify(userDetails), { expires: 30, path: '/' });
    } else {
      Cookies.remove("userDetails", { path: '/' });
    }
  }, [userDetails]);

  useEffect(() => {
     const checkAuth = async () => {
         if (userDetails) {
             try {
                     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
                         headers: {
                             'Authorization': `Bearer ${Cookies.get('jwt_token')}`
                         }
                     });
                     if (!response.ok) {
                         setUserDetails(null);
                         Cookies.remove("userDetails", { path: '/' });
                         Cookies.remove("jwt_token", { path: '/' });
                     }
             } catch (error) {
                 console.error("Auth check failed:", error);
                 setUserDetails(null); 
             }
         }
     };
     checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
