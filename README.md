# BranchesGPT

A modern web application that combines the power of GPT with a user-friendly interface for managing and interacting with AI-powered conversations.

## 🚀 Features

- Modern React-based frontend with Material-UI and Tailwind CSS
- TypeScript-based Express.js backend
- Real-time chat interface
- Secure authentication system
- Responsive design for all devices
- Drag-and-drop interface components
- Beautiful and intuitive UI

## 🛠️ Tech Stack

### Frontend
- React 18
- Material-UI
- Tailwind CSS
- React Router
- Axios for API calls
- React Beautiful DnD for drag-and-drop
- Styled Components
- Bootstrap

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- OpenAI Integration
- Express Validator
- CORS enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- OpenAI API key

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/BranchesGPT.git
cd BranchesGPT
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
npm run install-server

# Install frontend dependencies
npm run install-client
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Running the Application

1. Start the backend server:
```bash
npm run start-server
```

2. Start the frontend development server:
```bash
npm run start-client
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
BranchesGPT/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API integration
│   │   └── hooks/        # Custom React hooks
│   └── public/           # Static files
├── backend/              # Express.js backend application
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utility functions
└── chart/               # Chart-related components
```

## 🤝 Contributing

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Flynn Park - Initial work

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- All contributors who have helped shape this project
