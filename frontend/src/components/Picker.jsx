import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";

const Picker = ({ onEmojiSelect }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [pickerStyle, setPickerStyle] = useState({});
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const handleEmojiClick = (emojiObject) => {
    onEmojiSelect(emojiObject.emoji);
  };

  const calculatePickerPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      return {
        position: "fixed",
        left: `${buttonRect.left}px`,
        bottom: `${buttonRect.bottom * 0.18 + 10}px`,
        zIndex: 10000,
        transformOrigin: "center bottom",
        transform: "scale(1)",
        opacity: "1",
        maxWidth: "340px",
        width: "375px",
        borderRadius: "var(--radius-app)",
        backgroundColor: "var(--dropdown-background)",
        boxShadow:
          "0 2px 5px 0 rgba(var(--shadow-rgb), .26), 0 2px 10px 0 rgba(var(--shadow-rgb), .16)",
      };
    }
    return {};
  };

  const togglePopup = (e) => {
    e.preventDefault();
    if (e.key === "Enter") return;
    if (!showPopup) {
      const newPosition = calculatePickerPosition();
      setPickerStyle(newPosition);
    }
    setShowPopup(!showPopup);
  };

  const handleOutsideClick = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) && // Click outside popup
      buttonRef.current &&
      !buttonRef.current.contains(event.target) // Click outside button
    ) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPopup]);

  return (
    <div>
      {showPopup && (
        <div ref={popupRef} style={pickerStyle}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <button
        type="button"
        ref={buttonRef}
        onClick={togglePopup}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <Smile />
      </button>
    </div>
  );
};

export default Picker;
