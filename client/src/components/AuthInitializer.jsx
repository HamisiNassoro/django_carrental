import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "../features/auth/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  return children;
};

export default AuthInitializer;
