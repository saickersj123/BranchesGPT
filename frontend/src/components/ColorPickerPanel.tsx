import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBold, faClock, faSun, faUndo } from '@fortawesome/free-solid-svg-icons';
import { ChromePicker, ColorResult } from 'react-color';
import '../css/ColorPickerPanel.css';

interface ColorPickerPanelProps {
  myChatBubbleColor: string;
  setMyChatBubbleColor: (color: string) => void;
  myChatTextColor: string;
  setMyChatTextColor: (color: string) => void;
  otherChatBubbleColor: string;
  setOtherChatBubbleColor: (color: string) => void;
  otherChatTextColor: string;
  setOtherChatTextColor: (color: string) => void;
  chatBubbleBold: boolean;
  setChatBubbleBold: (bold: boolean) => void;
  chatBubbleShadow: boolean;
  setChatBubbleShadow: (shadow: boolean) => void;
  chatContainerBgColor: string;
  setChatContainerBgColor: (color: string) => void;
  showTime: boolean;
  setShowTime: (show: boolean) => void;
  timeBold: boolean;
  setTimeBold: (bold: boolean) => void;
  closePanel: () => void;
}

const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
  myChatBubbleColor,
  setMyChatBubbleColor,
  myChatTextColor,
  setMyChatTextColor,
  otherChatBubbleColor,
  setOtherChatBubbleColor,
  otherChatTextColor,
  setOtherChatTextColor,
  chatBubbleBold,
  setChatBubbleBold,
  chatBubbleShadow,
  setChatBubbleShadow,
  chatContainerBgColor,
  setChatContainerBgColor,
  showTime,
  setShowTime,
  timeBold,
  setTimeBold,
  closePanel,
}) => {
  const textColors = ['#000000', '#FFFFFF', '#87CEEB'];
  const bubbleColors = ['#FFFFE0', '#87CEFA', '#98FB98', '#FFC0CB', '#333333'];
  const bgColors = ['#D3D3D3', '#FFFFFF', '#B0E0E6', '#2F4F4F', '#121212', '#212121'];
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [colorType, setColorType] = useState<string>('myChatBubble');
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        closePanel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closePanel]);

  useEffect(() => {
    const handleClickOutsideColor = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setDisplayColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideColor);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideColor);
    };
  }, []);

  useEffect(() => {
    const colorPicker = document.querySelector('.color-picker-popover');
    if (colorPicker) {
      const rect = colorPicker.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        (colorPicker as HTMLElement).style.top = `${window.innerHeight - rect.height - 20}px`;
      }
    }
  }, [displayColorPicker]);

  const handleColorClick = (type: string) => {
    setColorType(type);
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleColorClose = () => {
    setDisplayColorPicker(false);
  };

  const handleColorChange = (color: ColorResult) => {
    const colorHex = color.hex;
    switch (colorType) {
      case 'myChatBubble':
        setMyChatBubbleColor(colorHex);
        localStorage.setItem('myChatBubbleColor', colorHex);
        break;
      case 'myChatText':
        setMyChatTextColor(colorHex);
        localStorage.setItem('myChatTextColor', colorHex);
        break;
      case 'otherChatBubble':
        setOtherChatBubbleColor(colorHex);
        localStorage.setItem('otherChatBubbleColor', colorHex);
        break;
      case 'otherChatText':
        setOtherChatTextColor(colorHex);
        localStorage.setItem('otherChatTextColor', colorHex);
        break;
      case 'chatContainerBg':
        setChatContainerBgColor(colorHex);
        localStorage.setItem('chatContainerBgColor', colorHex);
        break;
      default:
        break;
    }
  };

  const handleToggleSetting = (settingName: string, setter: (value: boolean) => void, currentValue: boolean) => {
    const newValue = !currentValue;
    setter(newValue);
    localStorage.setItem(settingName, JSON.stringify(newValue));
  };

  const handleCloseClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      closePanel();
      setIsClosing(false);
    }, 300);
  };

  const handleResetSettings = () => {
    setMyChatBubbleColor('#DCF8C6');
    setMyChatTextColor('#000000');
    setOtherChatBubbleColor('#F0F0F0');
    setOtherChatTextColor('#000000');
    setChatBubbleBold(false);
    setChatBubbleShadow(false);
    setChatContainerBgColor('#FFFFFF');
    setShowTime(true);
    setTimeBold(false);
    localStorage.removeItem('myChatBubbleColor');
    localStorage.removeItem('myChatTextColor');
    localStorage.removeItem('otherChatBubbleColor');
    localStorage.removeItem('otherChatTextColor');
    localStorage.removeItem('chatBubbleBold');
    localStorage.removeItem('chatBubbleShadow');
    localStorage.removeItem('chatContainerBgColor');
    localStorage.removeItem('showTime');
    localStorage.removeItem('timeBold');
  };

  return (
    <div className={`panel-container ${isClosing ? 'close' : 'open'}`} ref={panelRef}>
      <div className="panel-header">
        <FontAwesomeIcon icon={faTimes} onClick={handleCloseClick} />
      </div>
      <div className="panel-content">
        <div className="panel-section">
          <h3>채팅 설정</h3>
          <div className="form-group">
            <label className="form-label">말풍선(사용자)</label>
            <div className="color-buttons">
              {bubbleColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setMyChatBubbleColor(color);
                    localStorage.setItem('myChatBubbleColor', color);
                  }}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('myChatBubble')} />
              {displayColorPicker && colorType === 'myChatBubble' && (
                <div className="color-picker-popover" ref={colorPickerRef}>
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker className="chrome-picker" color={myChatBubbleColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">텍스트(나)</label>
            <div className="color-buttons">
              {textColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setMyChatTextColor(color);
                    localStorage.setItem('myChatTextColor', color);
                  }}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('myChatText')} />
              {displayColorPicker && colorType === 'myChatText' && (
                <div className="color-picker-popover" ref={colorPickerRef}>
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker className="chrome-picker" color={myChatTextColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">말풍선(Bot)</label>
            <div className="color-buttons">
              {bubbleColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setOtherChatBubbleColor(color);
                    localStorage.setItem('otherChatBubbleColor', color);
                  }}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('otherChatBubble')} />
              {displayColorPicker && colorType === 'otherChatBubble' && (
                <div className="color-picker-popover" ref={colorPickerRef}>
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker className="chrome-picker" color={otherChatBubbleColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">텍스트(Bot)</label>
            <div className="color-buttons">
              {textColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setOtherChatTextColor(color);
                    localStorage.setItem('otherChatTextColor', color);
                  }}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('otherChatText')} />
              {displayColorPicker && colorType === 'otherChatText' && (
                <div className="color-picker-popover" ref={colorPickerRef}>
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker className="chrome-picker" color={otherChatTextColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">배경 색상</label>
            <div className="color-buttons">
              {bgColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setChatContainerBgColor(color);
                    localStorage.setItem('chatContainerBgColor', color);
                  }}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('chatContainerBg')} />
              {displayColorPicker && colorType === 'chatContainerBg' && (
                <div className="color-picker-popover" ref={colorPickerRef}>
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker className="chrome-picker" color={chatContainerBgColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label"></label>
            <div className="icon-buttons">
              <button className={`icon-button ${chatBubbleBold ? 'active' : ''}`} onClick={() => handleToggleSetting('chatBubbleBold', setChatBubbleBold, chatBubbleBold)}>
                <FontAwesomeIcon icon={faBold} />
              </button>
              <button className={`icon-button ${chatBubbleShadow ? 'active' : ''}`} onClick={() => handleToggleSetting('chatBubbleShadow', setChatBubbleShadow, chatBubbleShadow)}>
                <FontAwesomeIcon icon={faSun} />
              </button>
              <button className={`icon-button ${timeBold ? 'active' : ''}`} onClick={() => handleToggleSetting('timeBold', setTimeBold, timeBold)}>
                <FontAwesomeIcon icon={faClock} />
              </button>
              <button className="icon-button" onClick={handleResetSettings}>
                <FontAwesomeIcon icon={faUndo} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerPanel;