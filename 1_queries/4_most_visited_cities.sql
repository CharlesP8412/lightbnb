SELECT city, COUNT(res.id) AS total_reservations
FROM properties
JOIN reservations res ON res.property_id = properties.id
GROUP BY city
ORDER BY total_reservations DESC;