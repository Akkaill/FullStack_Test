SELECT
    r.level,
    r.room_name AS roomName,
    s.gender,
    COUNT(*) AS total
FROM
    room_members rm
    JOIN rooms r ON r.id = rm.room_id
    JOIN students s ON s.id = rm.student_id
WHERE
    rm.left_at IS NULL
GROUP BY
    r.level,
    r.room_name,
    s.gender
ORDER BY
    r.level,
    r.room_name,
    s.gender;