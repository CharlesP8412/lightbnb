SELECT properties.*, AVG(reviews.rating) AS avg_rating
FROM properties
JOIN property_reviews reviews ON reviews.property_id = properties.id
WHERE properties.city LIKE '%Vancouver%' 
GROUP BY properties.id
HAVING AVG(reviews.rating) >=4 
ORDER BY properties.cost_per_night
LIMIT 10;
