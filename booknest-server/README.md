# BookNest API (Express + MongoDB)

    npm install
    cp .env.example .env      # set MONGO_URI and a long JWT_SECRET
    npm run seed              # creates the admin + default categories
    npm run dev               # http://localhost:5000

Ensure the React client's .env points to VITE_API_URL=http://localhost:5000/api and VITE_FILE_URL=http://localhost:5000.

Change the seeded admin password after first login. Public sign-up always creates role "user".
