import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ColorChooser = ({ availableColors, onSelectedColorChange }) => {
  const [selectedColor, setSelectedColor] = useState('');

  const setColor = (color) => {
    // If the color is already selected, reset the selection
    if (selectedColor === color) {
      setSelectedColor('');
      onSelectedColorChange(null); // Passing null to indicate deselection
    } else {
      setSelectedColor(color);
      onSelectedColorChange(color); // Notify the parent component of the new color
    }
  };

  return (
    <div className="color-chooser">
      {availableColors.map((color) => (
        <div
          className={selectedColor === color ? 'color-item color-item-selected' : 'color-item'}
          key={color}
          onClick={() => setColor(color)}
          style={{ backgroundColor: color }}
          role="presentation"
        />
      ))}
    </div>
  );
};

ColorChooser.propTypes = {
  availableColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectedColorChange: PropTypes.func.isRequired
};

export default ColorChooser;
