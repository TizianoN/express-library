const connection = require("../db/conn");

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

  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: 'Database query failed'
      })
    };

    const books = results.map(book => ({
      ...book,
      image: generateBookImagePath(book.image)
    }));

    res.json({
      status: 'OK',
      books
    });
  })
}

function show(req, res) {
  const bookId = req.params.id;

  const sqlBook = `
    SELECT id, title, author, abstract, image
    FROM books
    WHERE id = ?
  `;

  connection.query(sqlBook, [bookId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        status: "KO",
        message: 'Database query failed'
      })
    };

    const [book] = results;

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
    `;

    connection.query(sqlReviews, [bookId], (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          status: "KO",
          message: 'Database query failed'
        })
      };

      book.reviews = results;

      res.json({
        status: 'OK',
        book
      });
    })
  })
}

const generateBookImagePath = (imageName) => {
  const { APP_HOST, APP_PORT } = process.env;
  return `${APP_HOST}:${APP_PORT}/img/books/${imageName}`
};

module.exports = { index, show }