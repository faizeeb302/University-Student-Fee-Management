// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '', // or your XAMPP MySQL password
//   database: 'student_management',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });


// export default pool;
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

export default connection;


