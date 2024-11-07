# EatWellthy 🍲
A web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) to promote healthy eating habits! This README will guide you through setting up the project, managing changes, and making contributions.

---

## 🛠️ Getting Started

### 1. Clone the Repository
Clone the entire repository using Git or the GitHub Desktop app:
   - **GitHub Desktop**: The app is beginner-friendly after a few tries and allows you to manage repositories easily.
   - **Git Command Line**: If you prefer the terminal, use:
     ```bash
     git clone <repository-url>
     ```

### 2. Fetch Latest Changes Regularly
Before making changes or reviewing code, always fetch the latest updates to stay in sync with the team:
   - In GitHub Desktop: Click **Fetch Origin**.
   - Or in the terminal:
     ```bash
     git fetch origin
     ```

### 3. Open the Repository Locally
   - Navigate to the cloned folder on your laptop, named `Github\EatWellthy`.
   - Open PowerShell (Windows) or a terminal in VS Code to access the project directory.

### 4. Navigate to Project Folder
   Open a terminal in the `EatWellthy` directory. Replace `WhereYouStoreTheProject` with your project’s actual path:
   ```bash
   cd "WhereYouStoreTheProject\EatWellthy"
   ```

---

## 🚀 Running the Application

To run the app, follow these steps:
1. **Navigate to the client directory**:
   ```bash
   cd client
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Backend**:
   ```bash
   cd ../backend
   npm start
   ```
4. **Open in Browser**:
   The web app should open in your default browser.

---

## 🔄 Making & Managing Changes

After making updates, use the GitHub Desktop app to:
1. **Commit and Push**:
   - Make a commit with a description of your changes.
   - Push to the repository to update it for others.

2. **Undo Changes** (if needed):
   - Right-click on the modified file in GitHub Desktop and select “Discard Changes” to undo any uncommitted modifications.

---

## 🔗 Database Connection Setup

To connect components with the database, you’ll likely edit these files:
   - **Backend**:
     - `models`
     - `routes`
     - `server.js`
   - **Client**:
     - `src/actions`
     - `src/components/reducers`

---

## 📦 Reinstalling Modules

If modules need reinstalling (usually in the `client` folder):
1. **Navigate to the client directory**:
   ```bash
   cd client
   ```
2. **Remove Existing Modules**:
   - Windows:
     ```bash
     Remove-Item -Recurse -Force .\node_modules
     ```
   - Mac & Linux:
     ```bash
     rm -rf node_modules
     ```
3. **Install Dependencies with Legacy Peer Deps**:
   ```bash
   npm install --legacy-peer-deps
   ```
   - For subsequent installs, you can simply use:
     ```bash
     npm install
     ```

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

## 📝 Additional Notes

- Make sure to frequently fetch changes from the origin to prevent merge conflicts.
- Always test the application after making significant changes, especially those involving the backend or database.

---

Happy coding with **EatWellthy**! 💪
