Here's a README specifically for the frontend (client) of **EatWellthy**:

---

# EatWellthy Client 🍲

The frontend interface of **EatWellthy**, a MERN-stack web application that promotes healthy eating habits through smart meal planning and nutrition tracking. Built with **React.js** for a responsive and engaging user experience, this client-side code communicates with the backend API to provide meal recommendations, track nutritional intake, and integrate with multiple services.

## 🚀 Tech Stack
- **React.js**: For building a dynamic, component-based user interface
- **Axios**: For API requests and handling backend communication
- **React Router**: For seamless navigation between pages
- **Recharts**: For visualizing nutrition data with interactive charts

## 🌐 Live Demo
Access the live demo of **EatWellthy**: [EatWellthy on Render](https://eatwellthy.onrender.com)  
(Note: The application may be inactive periodically.)

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure **Node.js** is installed on your machine.

### 2. Clone the Repository
Clone the frontend portion of the **EatWellthy** repository:
```bash
git clone <repository-url>
cd EatWellthy/client
```

### 3. Install Dependencies
Run the following command to install the necessary packages:
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the `client` directory with the following structure for API keys:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 5. Run the Client
Start the frontend client using:
```bash
npm start
```
The application will run at `http://localhost:3000` by default.

---

## 📌 Core Components

### Authentication
- **Login & Register**: Uses Google OAuth and standard email authentication to ensure a secure experience.
- **Protected Routes**: Some pages are accessible only to authenticated users.

### Meal Planning & Nutrition Tracking
- **Smart Meal Planning**: Allows users to create personalized meal plans based on their dietary preferences and goals.
- **Real-Time Tracking**: Users can monitor their daily intake of calories, macros, and micros with visualized data.

### User Dashboard
- **Personalized Summary**: Daily summaries with calories consumed, remaining intake, and progress towards goals.
- **Interactive Charts**: Track macro and micro nutrients over time with visual progress indicators.

### Welloh AI Assistant
- An interactive AI assistant powered by OpenAI, Welloh provides personalized meal recommendations and answers user inquiries.

### Grocery Finder & Calendar Sync
- **Grocery Locator**: Integrated with Google Maps to locate nearby grocery stores.
- **Calendar Sync**: Syncs meal plans with Google Calendar for easy reminders and scheduling.

---

## 🛠 Development Workflow

### Regular Updates
Pull the latest changes before starting development:
```bash
git fetch origin
git pull origin main
```

### Branching and Committing
- Create a feature branch for each new feature:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Commit and push:
  ```bash
  git add .
  git commit -m "Description of changes"
  git push origin feature/your-feature-name
  ```

---

## 📦 Troubleshooting

### Common Issues
- **Environment Variables**: Ensure `.env` file is correctly configured and all required API keys are provided.
- **API Communication**: Verify that the backend server is running and reachable at the expected base URL.
- **Dependencies**: If issues arise, try deleting `node_modules` and reinstalling:
  ```bash
  rm -rf node_modules  # Or `Remove-Item -Recurse -Force .\node_modules` on Windows
  npm install --legacy-peer-deps
  ```

---

## 🔌 API Integrations

The **EatWellthy Client** leverages multiple APIs to create a feature-rich user experience:

### Nutritionix API
Provides a database of food items with detailed nutritional information, used for meal planning and tracking.

### OpenAI API
Powers Welloh, the AI assistant that helps users with meal recommendations and health tips.

### Google Maps API
Helps users locate nearby grocery stores for easy ingredient shopping.

### Google Calendar API
Enables users to sync their meal plans with Google Calendar to stay on track with reminders and schedules.

### Google OAuth 2.0
Facilitates secure login with Google for a seamless authentication experience.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## 📚 Documentation
Further documentation on the app’s functionality and architecture will be added soon.

---

Happy coding with **EatWellthy Client**! 🍽

---
---

---

✨ _"Eat rich and healthy with EatWellthy!"_ ✨

---


---
---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
