# BookNest client (React + Vite)

    npm install
    cp .env.example .env
    npm run dev

API additions beyond the SRS table (needed by the UI):
- GET /api/saved, POST /api/saved/:bookId, DELETE /api/saved/:bookId  (My Books)
- GET /api/stats  (admin dashboard counts + recent books)
- PUT /api/users/:id also serves profile edits (name, profileImage) and admin status changes
- POST/PUT /api/books and PUT /api/users/:id accept multipart/form-data (Multer fields: coverImage, bookFile, profileImage)
