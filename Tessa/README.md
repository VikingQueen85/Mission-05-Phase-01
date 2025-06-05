

# Mission 5 Phase 1: TradeMe Auction Item Lister

This project is a web application designed to list and search auction items, simulating a simplified TradeMe experience. It features a robust Node.js/Express backend with a MongoDB database for data storage, and a dynamic Next.js frontend built with React for an interactive user experience.

The application focuses on demonstrating:
* **Backend API Development:** A RESTful API for managing auction item data.
* **Database Management:** Integration with MongoDB for persistent storage.
* **Data Seeding & Management:** A command-line tool to populate and clear the database.
* **Frontend Data Consumption:** A modern React application (built with Next.js) that fetches and displays data from the backend.
* **Search Functionality:** Ability to search auction items by keywords in their title and description.
* **Minimum Data View:** A dedicated page to display only essential item information, addressing data overload.

## Installation

This project uses **npm** as its package manager.

To get the project up and running on your local machine, follow these steps:

### Prerequisites

* **Node.js & npm:** Ensure you have Node.js (which includes npm) installed.
* **MongoDB:** Have a MongoDB instance running locally. The backend expects to connect to `mongodb://127.0.0.1:27017/trademe_products`.

### Steps

1.  **Clone the Repository**
    Project structure:
    ```
    your-project-folder/
    ├── client/
    └── server/
    ```
    Navigate into your main project folder in your terminal:
    ```bash
    cd C:\Users\missr\Desktop\Mission05\Tessa\mission-5-phase-1-individual-VikingQueen85
    ```

2.  **Backend Setup:**
    * Navigate into the `server` directory:
        ```bash
        cd server
        ```
    * Install backend dependencies:
        ```bash
        npm install
        ```
    * Seed the database with initial data (this will connect to your running MongoDB):
        ```bash
        npm run seed
        ```
    * Start the backend API server:
        ```bash
        npm start
        ```
        Keep this terminal window open. The server should be running on `http://localhost:5000`.

3.  **Frontend Setup:**
    * Open a **new** terminal window.
    * Navigate into the `client` directory:
        ```bash
        cd client
        ```
    * Install frontend dependencies:
        ```bash
        npm install
        ```
    * Start the Next.js development server:
        ```bash
        npm run dev
        ```
        Keep this terminal window open. The frontend should be running on `http://localhost:3000`.

### Accessing the Application

Once both the backend and frontend servers are running:

* Open your web browser and navigate to:
    ```
    http://localhost:3000
    ```
    This will display the main auction item listing page with search functionality.

* To view the "minimum data" summary page, navigate to:
    ```
    http://localhost:3000/summary
    ```

## More Details

This project is structured as a Monorepo containing two distinct applications:

* **Backend (`/server`):**
    * Built with Node.js and Express.js.
    * Connects to a MongoDB database using Mongoose.
    * Exposes a RESTful API for auction items.
    * **Key Endpoints:**
        * `GET /api/items`: Retrieves all auction items. Supports a `?search=<keyword>` query parameter for searching by title and description.
        * `GET /api/items/summary`: Retrieves auction items with only `title`, `start_price`, and `reserve_price` fields, providing a concise overview.
        * `GET /api/items/:id`: Retrieves a single auction item by its ID.
    * Includes a CLI tool (`server/cli/seed_tool.js`) to `seed` (add) or `delete` all data from the database.

* **Frontend (`/client`):**
    * Developed using Next.js (App Router) and React, written entirely in JavaScript (`.jsx` files).
    * Consumes the backend API using `axios`.
    * **Main Page (`/`):** Displays a comprehensive list of auction items and includes a search bar to filter results.
    * **Summary Page (`/summary`):** Demonstrates fetching a minimal dataset, showing only the title, start price, and reserve price for each item.
    * Utilizes Next.js's `next.config.js` to set up a proxy (`/api`) during development, seamlessly redirecting frontend API calls to the backend (`http://localhost:5000`) to avoid CORS issues.

This separation allows for independent development and scaling of the frontend and backend components.