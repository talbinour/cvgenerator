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
        <select className={`${styles['palette-input']} ${styles['palette-font-weight']}`} value={fontWeight} onChange={handleFontWeightChange}>
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Lighter</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
          <option value="900">900</option>
        </select>
      </label>
      <br />
      <label className={styles['palette-label']}>
        Font Style:
        <select className={`${styles['palette-input']} ${styles['palette-font-style']}`} value={fontStyle} onChange={handleFontStyleChange}>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="oblique">Oblique</option>
          <option value="inherit">Inherit</option>
          <option value="initial">Initial</option>
          <option value="unset">Unset</option>
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
