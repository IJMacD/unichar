WITH RECURSIVE generate_series(value) AS (
  SELECT 0
  UNION ALL
  SELECT value+1 FROM generate_series
   WHERE value+1<9799
),
mapping(value, taiwan, mainland) AS (
	SELECT
		value,
		COALESCE(t.code,0),
		COALESCE(m.code,0)
	FROM generate_series AS s
	LEFT JOIN
		kTaiwanTelegraphTable AS t ON s.value = CAST(t.kTaiwanTelegraph AS INT)
	LEFT JOIN
		kMainlandTelegraphTable AS m ON s.value = CAST(m.kMainlandTelegraph AS INT)
	GROUP BY s.value
)
SELECT
	json_group_array(taiwan),
	json_group_array(mainland)
FROM
	mapping