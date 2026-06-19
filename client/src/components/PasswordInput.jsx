import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-input-wrapper">
      <input
        type={visible ? "text" : "password"}
        className={`form-control password-input ${className}`}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        autoComplete={name === "password2" ? "new-password" : undefined}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default PasswordInput;
