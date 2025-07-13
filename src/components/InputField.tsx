import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', value, onChange }) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-box"
      />
    </div>
  );
};

export default InputField;
