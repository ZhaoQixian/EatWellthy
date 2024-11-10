# EatWellthy 🍲
A comprehensive web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to revolutionize healthy eating habits through intelligent meal planning and nutrition tracking.

## 🌐 Live Demo & Deployment
- **Demo Video**: [Watch on YouTube](https://www.youtube.com/watch?v=_jXpvho58wg)
- **Deployed Application**: [EatWellthy on Render](https://eatwellthy.onrender.com)
- This deployed application may be inactive periodically
- It is highly recommended to clone this repository and use localhost

## 👥 Team Members
- [LIU XIAOTAO](https://github.com/Neurotic58)
- [LOW JO YI, NICOLE](https://github.com/Nicoleelow)
- [MAHI PANDEY](https://github.com/mahipandcy)
- [MEHTA RISHIKA](https://github.com/Oganesson0221)
- [ZHANG YICHI](https://github.com/CatilonyZhang)
- [ZHAO QIXIAN](https://github.com/ZhaoQixian)

## ✨ Core Features
### 🍽️ Smart Meal Planning
- Comprehensive nutritional information from reliable Nutritionix API
- Custom recipe creation and storage
- Daily meal plan suggestion based on profile information 

### 📊 Nutrition Analytics
- Real-time calorie and macro tracking
- Detailed breakdown of macro and micro nutrients
- Progress visualization with interactive charts

### 👤 User Experience
- Personalized dashboard with daily summaries
- Intuitive meal planning interface with drag-and-drop functionality
- Responsive AI assistant Welloh for any user inquery 

---
## 🛠️ Getting Started
### 1. Clone the Repository
Clone the entire repository using Git or the GitHub Desktop app:
   - **GitHub Desktop**: Recommended for beginners - provides a user-friendly interface
   - **Git Command Line**:
     ```bash
     git clone <repository-url>
     ```

### 2. Environment Setup
Open the .env file at EatWellthy/backend/.env_example, key in your API keys
```
MONGODB_URI=your_mongodb_uri
NUTRITION_API_KEY=your_api_key
```

### 3. Install Dependencies
Under the eatwellthy directory:
```bash
npm install
npm run install-all
npm run dev
```
The web app will automatically open in your default browser.

---
## 🔄 Development Workflow
### Regular Updates
Before making changes:
```bash
git fetch origin
git pull origin main
```

### Making Changes
1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```
2. Make your changes
3. Commit and push:
```bash
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
```

---
## 📦 Troubleshooting
If modules need reinstalling:
```bash
cd client
rm -rf node_modules  # or Remove-Item -Recurse -Force .\node_modules on Windows
npm install --legacy-peer-deps

```
## 🔌 API Integrations
EatWellthy leverages several powerful APIs to provide a comprehensive health and nutrition experience:
### 🥗 Nutritionix API
- Complete food database with accurate nutritional information and natural language processing
### 🤖 OpenAI Integration
- Personalised meal recommendations interactive chatbot Welloh powered by AI
### 📍 Google Maps API
- Locate and grocery stores in your area conveniently
### 📅 Google Calendar API
- Seamlessly sync meal plans and set reminders in your google calendar
### ✉️ Brevo API
- Streamlined email verification and password reset
### 🔐 Google OAuth 2.0
- Secure authentication with cross-device profile synchronization


## 📚 Documentation
- will add later


## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## 📝 Additional Notes
- Regularly pull changes from main to stay updated
- Follow the README.md for operation guidance
- The application uses [Nutrition API Name] for food data
- Deployed on Render's platform


## 🔗 References
- add later

Happy coding with **EatWellthy**! 💪
