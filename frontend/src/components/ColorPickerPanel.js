import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ChromePicker } from 'react-color';
import '../css/ColorPickerPanel.css';

const ColorPickerPanel = ({
  navbarTextColor,
  setNavbarTextColor,
  navbarBold,
  setNavbarBold,
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
  darkMode
}) => {
  const textColors = ['#000000', '#FFFFFF', '#87CEEB'];
  const bubbleColors = ['#FFFFE0', '#87CEFA', '#98FB98', '#FFC0CB', '#333333'];
  const bgColors = ['#D3D3D3', '#FFFFFF', '#B0E0E6', '#2F4F4F', '#121212', '#212121'];
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [colorType, setColorType] = useState('navbarText');

  useEffect(() => {
    const colorPicker = document.querySelector('.color-picker-popover');
    if (colorPicker) {
      const rect = colorPicker.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        colorPicker.style.top = `${window.innerHeight - rect.height - 20}px`;
      }
    }
  }, [displayColorPicker]);

  const handleColorClick = (type) => {
    setColorType(type);
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleColorClose = () => {
    setDisplayColorPicker(false);
  };

  const handleColorChange = (color) => {
    switch (colorType) {
      case 'navbarText':
        setNavbarTextColor(color.hex);
        break;
      case 'myChatBubble':
        setMyChatBubbleColor(color.hex);
        break;
      case 'myChatText':
        setMyChatTextColor(color.hex);
        break;
      case 'otherChatBubble':
        setOtherChatBubbleColor(color.hex);
        break;
      case 'otherChatText':
        setOtherChatTextColor(color.hex);
        break;
      case 'chatContainerBg':
        setChatContainerBgColor(color.hex);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`panel-container ${darkMode ? 'dark' : ''}`}>
      <div className="panel-header">
        <FontAwesomeIcon icon={faTimes} onClick={closePanel} />
      </div>
      <div className="panel-content">
        <div className="panel-section">
          <h3>상단 설정</h3>
          <div className="form-group">
            <label className="form-label">상단 텍스트 색상</label>
            <div className="color-buttons">
              {textColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => setNavbarTextColor(color)}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('navbarText')} />
              {displayColorPicker && colorType === 'navbarText' && (
                <div className="color-picker-popover">
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker color={navbarTextColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">상단 텍스트 볼드체</label>
            <input type="checkbox" checked={navbarBold} onChange={(e) => setNavbarBold(e.target.checked)} />
          </div>
        </div>
        <div className="panel-section">
          <h3>채팅 설정</h3>
          <div className="form-group">
            <label className="form-label">내가 보낸 말풍선 색상</label>
            <div className="color-buttons">
              {bubbleColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => setMyChatBubbleColor(color)}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('myChatBubble')} />
              {displayColorPicker && colorType === 'myChatBubble' && (
                <div className="color-picker-popover">
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker color={myChatBubbleColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">내가 보낸 말풍선 텍스트 색상</label>
            <div className="color-buttons">
              {textColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => setMyChatTextColor(color)}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('myChatText')} />
              {displayColorPicker && colorType === 'myChatText' && (
                <div className="color-picker-popover">
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker color={myChatTextColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">상대방이 보낸 말풍선 색상</label>
            <div className="color-buttons">
              {bubbleColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => setOtherChatBubbleColor(color)}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('otherChatBubble')} />
              {displayColorPicker && colorType === 'otherChatBubble' && (
                <div className="color-picker-popover">
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker color={otherChatBubbleColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">상대방이 보낸 말풍선 텍스트 색상</label>
            <div className="color-buttons">
              {textColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => setOtherChatTextColor(color)}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('otherChatText')} />
              {displayColorPicker && colorType === 'otherChatText' && (
                <div className="color-picker-popover">
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker color={otherChatTextColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">말풍선 볼드체</label>
            <input type="checkbox" checked={chatBubbleBold} onChange={(e) => setChatBubbleBold(e.target.checked)} />
          </div>
          <div className="form-group">
            <label className="form-label">말풍선 그림자</label>
            <input type="checkbox" checked={chatBubbleShadow} onChange={(e) => setChatBubbleShadow(e.target.checked)} />
          </div>
        </div>
        <div className="panel-section">
          <h3>배경 설정</h3>
          <div className="form-group">
            <label className="form-label">채팅 컨테이너 배경 색상</label>
            <div className="color-buttons">
              {bgColors.map(color => (
                <button
                  key={color}
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => setChatContainerBgColor(color)}
                />
              ))}
              <button className="color-picker-button" onClick={() => handleColorClick('chatContainerBg')} />
              {displayColorPicker && colorType === 'chatContainerBg' && (
                <div className="color-picker-popover">
                  <div className="color-picker-cover" onClick={handleColorClose} />
                  <ChromePicker color={chatContainerBgColor} onChange={handleColorChange} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="panel-section">
          <h3>기타 설정</h3>
          <div className="form-group">
            <label className="form-label">시간 정보 표시</label>
            <input type="checkbox" checked={showTime} onChange={(e) => setShowTime(e.target.checked)} />
          </div>
          <div className="form-group">
            <label className="form-label">시간 볼드체</label>
            <input type="checkbox" checked={timeBold} onChange={(e) => setTimeBold(e.target.checked)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerPanel;
