import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // 필요한 경우 별도의 CSS 파일

const Footer = () => (
  <footer className="footer">
    <p>&copy; GPT 서비스.</p>
    <nav>
      <Link to="/terms">이용 약관</Link>
      <Link to="/contact">연락처</Link>
    </nav>
  </footer>
);

export default Footer;
