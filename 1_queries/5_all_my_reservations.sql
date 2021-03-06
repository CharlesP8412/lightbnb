SELECT res.*, prop.*, AVG(rev.rating)
FROM reservations res
JOIN properties prop ON res.property_id = prop.id
JOIN property_reviews rev ON rev.property_id = prop.id
WHERE prop.owner_id = 1 AND end_date < NOW()::DATE
GROUP BY res.id, prop.title
ORDER BY start_date
LIMIT 10;