const connection = require("../db/conn");

/**
 * Funzione che mostra tutti i libri
 */
function index(req, res) {
  let sql = `
    SELECT id, title, author, image
    FROM books
  `;

  // let preparedArray = [];
  // let firstFilter = true;

  // if (req.query.title) {
  //   sql += `  ${firstFilter ? "WHERE" : "AND"} title LIKE ?`;
  //   preparedArray.push(`%${req.query.title}%`);
  //   firstFilter = false;
  // }

  // if (req.query.author) {
  //   sql += `  ${firstFilter ? "WHERE" : "AND"} author LIKE ?`;
  //   preparedArray.push(`%${req.query.author}%`);
  //   firstFilter = false;
  // }

  // console.log(sql);

  // connection.query(sql, preparedArray, (err, results) => {

  connection.query(sql, (err, books) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: 'Database query failed'
      })
    };

    books = books.map(book => ({
      ...book,
      image: generateBookImagePath(book.image)
    }));

    res.json({
      status: 'OK',
      books
    });
  })
}

/**
 * Funzione che mostra il dettaglio di un libro
 */
function show(req, res) {
  const bookId = req.params.id;

  const sqlBook = `
    SELECT id, title, author, abstract, image
    FROM books
    WHERE id = ?
  `;

  connection.query(sqlBook, [bookId], (err, books) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: 'Database query failed'
      })
    };

    const [book] = books;

    if (!book) {
      return res.status(404).json({
        status: "KO",
        message: 'Book not found'
      })
    }

    book.image = generateBookImagePath(book.image);

    const sqlReviews = `
      SELECT id, name, vote, text
      FROM reviews
      WHERE book_id = ?
      ORDER BY created_at DESC
    `;

    connection.query(sqlReviews, [bookId], (err, reviews) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          status: "KO",
          message: 'Database query failed'
        })
      };

      book.reviews = reviews;

      res.json({
        status: 'OK',
        book
      });
    })
  })
}

/**
 * Funzione che aggiunge una recensione ad un libro
 */
function storeReviewByBookId(req, res) {
  const bookId = req.params.id;
  const { name, text, vote } = req.body;

  let hasErrors = false;
  if (!name) hasErrors = true;
  if (!text) hasErrors = true;
  if (isNaN(parseInt(vote)) || vote < 1 || vote > 5) hasErrors = true;

  if (hasErrors) {
    return res.status(403).json({
      status: "KO",
      message: 'Invalid data'
    })
  }

  const sql = `
    INSERT INTO reviews (name, text, vote, book_id)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(sql, [name, text, vote, bookId], (err) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: 'Database query failed'
      })
    };

    res.json({
      status: 'OK',
      message: 'Review added'
    });
  });
}

/**
 * Funzione che recupera la lista di recensioni di un libro
 */
function getReviewsByBookId(req, res) {
  const bookId = req.params.id;

  const sql = `
    SELECT id, name, vote, text
    FROM reviews
    WHERE book_id = ?
    ORDER BY created_at DESC
  `;

  connection.query(sql, [bookId], (err, reviews) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: 'Database query failed'
      })
    };

    res.json({
      status: 'OK',
      reviews
    });
  });
}

/**
 * Funzione che genera il path assoluto dell'immagine di un libro partendo dal suo nome
 */
const generateBookImagePath = (imageName) => {
  const { APP_HOST, APP_PORT } = process.env;
  return `${APP_HOST}:${APP_PORT}/img/books/${imageName}`
};

module.exports = { index, show, storeReviewByBookId, getReviewsByBookId };