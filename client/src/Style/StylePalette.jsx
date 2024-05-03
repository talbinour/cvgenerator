import React, { useState } from 'react';
import styles from './StylePalette.module.css';

function StylePalette() {
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    setFontSize(parseInt(e.target.value));
  };

  const handleFontWeightChange = (e) => {
    setFontWeight(e.target.value);
  };

  const handleFontStyleChange = (e) => {
    setFontStyle(e.target.value);
  };

  const handleTextDecorationChange = (e) => {
    setTextDecoration(e.target.value);
  };

  return (
    <div className={styles['palette-container']}>
      <label className={styles['palette-label']}>
        Text Color:
        <input className={styles['palette-input']} type="color" value={textColor} onChange={handleTextColorChange} />
      </label>
      <br />
      <label className={styles['palette-label']}>
        Font Size:
        <input className={styles['palette-input']} type="number" value={fontSize} onChange={handleFontSizeChange} />
      </label>
      <br />
      <label className={styles['palette-label']}>
        Font Weight:
        <select className={styles['palette-input']} value={fontWeight} onChange={handleFontWeightChange}>
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Lighter</option>
        </select>
      </label>
      <br />
      <label className={styles['palette-label']}>
        Font Style:
        <select className={styles['palette-input']} value={fontStyle} onChange={handleFontStyleChange}>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="oblique">Oblique</option>
        </select>
      </label>
      <br />
      <label className={styles['palette-label']}>
        Text Decoration:
        <select className={styles['palette-input']} value={textDecoration} onChange={handleTextDecorationChange}>
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Line Through</option>
          <option value="overline">Overline</option>
        </select>
      </label>
      <br />
      <div className={styles['palette-text']} style={{ 
        color: textColor, 
        fontSize: `${fontSize}px`, 
        fontWeight,
        fontStyle,
        textDecoration,
      }}>
        Sample Text
      </div>
    </div>
  );
}

export default StylePalette;
