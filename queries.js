const { Pool } = require('pg')
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getUsers = async (request, response) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC')
    response.status(200).json(result.rows)
  } catch (error) {
    console.error('Error executing query', error.stack)
    response.status(500).send('Internal Server Error')
  }
}

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id)

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    response.status(200).json(result.rows)
  } catch (error) {
    console.error('Error executing query', error.stack)
    response.status(500).send('Internal Server Error')
  }
}

const createUser = async (request, response) => {
  const { name, email } = request.body

  try {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email])
    response.status(201).send(`User added with ID: ${result.rows[0].id}`)
  } catch (error) {
    console.error('Error executing query', error.stack)
    response.status(500).send('Internal Server Error')
  }
}

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  try {
    await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    )
    response.status(200).send(`User modified with ID: ${id}`)
  } catch (error) {
    console.error('Error executing query', error.stack)
    response.status(500).send('Internal Server Error')
  }
}

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id)

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    response.status(200).send(`User deleted with ID: ${id}`)
  } catch (error) {
    console.error('Error executing query', error.stack)
    response.status(500).send('Internal Server Error')
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}