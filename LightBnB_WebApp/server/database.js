const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  console.log("Getting user w. email..." + email)
  const queryString = (`SELECT * FROM users WHERE email = $1;`)
  const values = [email]
  return Promise.resolve(pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
  );
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  console.log("Getting user w. ID...")
  const queryString = (`SELECT * FROM users WHERE id = $1;`)
  const values = [id]
  return Promise.resolve(pool.query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
  );
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = (`
  INSERT INTO	users	(name, email, password)
  VALUES ($1,$2,$3) RETURNING *;
  `)
  const values = [user.name, user.email, user.password]
  return pool.query(queryString, values)
    .then(res => console.log(`Added user: ${user.name}`));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  // Rtns Reservations > Not set by Date ie > NOW()
  const queryString = (`
  SELECT res.*, prop.* , AVG(rating) AS average_rating
  FROM reservations res
  JOIN properties prop ON res.property_id = prop.id
  JOIN property_reviews rev ON rev.property_id =prop.id 
  WHERE res.guest_id = $1
  GROUP BY res.id, prop.id
  ORDER BY start_date DESC
  LIMIT $2;
  `)
  const values = [guest_id, limit]

  return Promise.resolve(pool.query(queryString, values)
    .then(res => {
      return res.rows;
    })
  );

}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT OUTER JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  for (const option in options) {
    if (options[option]) {
      if (queryParams.length > 0) {
        queryString += " AND ";
      } else if (queryParams.length === 0) {


  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);


  return pool.query(queryString, queryParams)
    .then(res => res.rows);

  // return Promise.resolve(pool.query(queryString, queryParams)
  //   .then(res => {
  //     return res.rows;
  //   })
  // );
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);

  const queryString = (`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE)
  RETURNING *;`)
  const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
  ]
  console.log(values)
  
  return pool.query(queryString, values)
    .then(res => console.log(`Added property`));

}
exports.addProperty = addProperty;
/*
// Property
[
  property.owner_id
  property.title
  property.description
  property.thumbnail_photo_url
  property.cover_photo_url
  property.cost_per_night
  property.street
  property.city
  property.province
  property.post_code
  property.country
  property.parking_spaces:
  property.number_of_bathrooms
  property.number_of_bedrooms
]
 */