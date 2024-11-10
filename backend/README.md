Certainly! Here’s a README specifically tailored for the backend of **EatWellthy**:

---

# EatWellthy Backend 🍲

The backend server for **EatWellthy**, a MERN-stack-based web application aimed at promoting healthier eating habits through intelligent meal planning and nutrition tracking. The backend handles API integrations, database management, authentication, and business logic for generating meal plans and analyzing nutritional data.

## 🚀 Tech Stack
- **Node.js** & **Express.js**: Server setup and RESTful API structure
- **MongoDB**: Database for storing user information, meal plans, and recipes
- **Mongoose**: ODM for MongoDB and data modeling
- **APIs**: Nutritionix, OpenAI, Google Maps, Google Calendar, Brevo, and Google OAuth for enhanced features and integrations

## 🌐 Live API Endpoints
**Base URL**: [`https://eatwellthy.onrender.com/api`](https://eatwellthy.onrender.com/api)

### Key Endpoints
- **Auth**: User authentication (sign up, login, logout) and Google OAuth 2.0 integration
- **Meal Planning**: Get and set meal plans based on nutritional data and user preferences
- **Nutrition Analytics**: Track and retrieve nutritional data
- **User Profiles**: User preferences, goals, and saved recipes
- **Integration APIs**: Calls to third-party APIs like Nutritionix, Google Maps, and OpenAI

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure **Node.js** and **MongoDB** are installed.

### 2. Clone the Repository
Clone the backend portion of the **EatWellthy** repository:
```bash
git clone <repository-url>
cd EatWellthy/backend
```

### 3. Install Dependencies
Run the following command to install the necessary packages:
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the backend directory with the following structure:

```env
MONGODB_URI=your_mongodb_uri
NUTRITION_API_KEY=your_nutritionix_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
BREVO_API_KEY=your_brevo_api_key
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
```

### 5. Run the Server
Start the backend server using:
```bash
npm run dev
```
The server will run at `http://localhost:5000` by default.

---

## 📌 API Structure

### Auth Routes
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Authenticate and login user
- **POST** `/auth/logout` - Log out user
- **GET** `/auth/google` - Google OAuth 2.0 login

### Meal Planning Routes
- **GET** `/meals/recommend` - Get AI-powered meal recommendations
- **POST** `/meals/save` - Save custom meal plan
- **GET** `/meals/user/:id` - Get saved meals for a user

### Nutrition Analytics Routes
- **GET** `/nutrition/track` - Fetch nutritional data for a specific meal or ingredient
- **POST** `/nutrition/track/update` - Update daily intake based on user consumption

### User Routes
- **GET** `/user/:id` - Fetch user profile data
- **PATCH** `/user/update` - Update user dietary preferences and goals

### Integration Routes
- **GET** `/api/maps/nearby-stores` - Fetch nearby grocery stores with Google Maps API
- **POST** `/api/calendar/sync` - Sync meal plans with Google Calendar

---

## 🔌 API Integrations

EatWellthy backend relies on multiple APIs for comprehensive meal planning and tracking:

### Nutritionix API
Provides a database of nutritional information, which is used to analyze food items in meal plans.

### OpenAI API
Powers Welloh, the AI assistant for personalized meal recommendations.

### Google Maps API
Helps users locate nearby grocery stores.

### Google Calendar API
Allows users to set reminders and sync meal plans with their Google Calendar.

### Brevo API
Handles email verification and password reset.

### Google OAuth 2.0
Secures user login with OAuth for Google accounts.

---

## 💡 Development Workflow

### Regular Updates
Keep your repository up to date by fetching changes regularly:
```bash
git fetch origin
git pull origin main
```

### Branching and Committing
- Create a feature branch for any new features:
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
- **Database Connection**: Ensure the `MONGODB_URI` in `.env` is correct and that MongoDB is running.
- **API Limit**: Some APIs have daily limits; if hitting these limits, consider upgrading to a paid plan or monitoring usage.
- **Dependency Issues**: Run `npm install --legacy-peer-deps` if there are peer dependency issues.

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

## 📚 Documentation
Further documentation will be added soon.

---

Happy coding with **EatWellthy Backend**! 🍲
