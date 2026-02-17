# YourFilms - Frontend

## Diploma Project

**YourFilms** is a modern, responsive web application for discovering, tracking, and reviewing movies and TV series. This project serves as the frontend client for a diploma thesis, demonstrating a full-stack implementation of a media content platform.

## Features

*   **User Authentication**: Secure registration and login system with JWT authentication.
*   **Trending Content**: View daily or weekly trending movies and TV shows.
*   **Discovery**: Filter content by genre, type (Movie/TV), year, and more.
*   **Search**: Real-time search functionality for finding specific titles.
*   **Detailed Information**: Comprehensive details for each title, including cast, crew, ratings, and overview.
*   **Personalization**:
    *   **Bookmarks**: Add titles to custom lists (Watching, Plan to Watch, Completed, Favorites).
    *   **Reviews**: Write and manage personal reviews and ratings.
*   **Profile Management**: User profile page displaying bookmarks and reviews.
*   **Responsive Design**: A premium dark-themed UI optimized for various device sizes.

## Tech Stack

*   **Framework**: [React](https://reactjs.org/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Styling**: CSS3 with modern features (Flexbox, Grid, Glassmorphism), tailored for a premium dark mode aesthetic.
*   **API Client**: Native `fetch` API for communicating with the backend.

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/YourFilms-web.git
    cd YourFilms-web
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application will start at `http://localhost:5173` (or the port specified by Vite).

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🔌 API Integration

This frontend interacts with a .NET Core backend API. Key integration points include:

*   **Authentication**: `/api/User/login`, `/api/User/register`
*   **Movies & TV**: `/api/Movies/trending`, `/api/Movies/search`, `/api/Movies/details`, `/api/Movies/discover`
*   **User Actions**: `/api/Bookmarks`, `/api/Reviews`

Ensure the backend service is running (default: `http://localhost:5000`) for full functionality.

## Project Structure

```
src/
├── components/     # Reusable UI components (MovieCard, Banner, etc.)
├── hooks/          # Custom React hooks (useDiscoveries, useGenres)
├── pages/          # Main application pages (Home, Details, Profile, etc.)
├── services/       # API integration service
├── store/          # Redux state management configuration and slices
├── styles/         # Global and component-specific CSS files
├── App.jsx         # Main application component and routing logic
└── main.jsx        # Entry point
```

## UI/UX Design

The application features a "Premium" design language characterized by:
*   **Dark Mode**: Immersive dark background with high-contrast text.
*   **Glassmorphism**: Translucent elements with blur effects.
*   **Micro-interactions**: Smooth hover effects and transitions.
*   **Grid Layouts**: Responsive grids for displaying media covers.

---
*Created by Oleksandr Revin as part of the Diploma Work.*
