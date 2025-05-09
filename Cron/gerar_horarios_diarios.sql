-- 1. Excluir os registros do dia anterior
DELETE FROM horario_atendente
WHERE DATE(data_hora) = CURDATE() - INTERVAL 1 DAY;

-- 2. Identificar o dia da semana atual (1 = domingo, ..., 7 = sábado)
SET @hoje_dia_semana := DAYOFWEEK(CURDATE());

-- 3. Gerar os horários para cada atendente com base no expediente
INSERT INTO horario_atendente (data_hora, ocupado, atendente_id)
SELECT
  DATE_ADD(CURDATE(), INTERVAL seq.minute MINUTE) AS data_hora,
  0 AS ocupado,
  e.atendente_id
FROM expediente e
JOIN atendente a ON e.atendente_id = a.id
JOIN (
  SELECT (t4.n * 60 + t3.n * 15) AS minute
  FROM
    (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
     UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
     UNION ALL SELECT 8 UNION ALL SELECT 9) t4,  -- horas
    (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t3  -- blocos de 15 min
) seq
WHERE e.dias_semana_id = @hoje_dia_semana
AND (
  -- Antes do intervalo
  DATE_ADD(CURDATE(), INTERVAL seq.minute MINUTE) BETWEEN 
    ADDTIME(CURDATE(), e.data_hora_entrada)
    AND 
    ADDTIME(CURDATE(), e.data_hora_intervalo)
  -- Depois do intervalo
  OR DATE_ADD(CURDATE(), INTERVAL seq.minute MINUTE) BETWEEN 
    ADDTIME(
      CURDATE(), 
      ADDTIME(e.data_hora_intervalo, SEC_TO_TIME(e.tempo_intervalo * 60))
    )
    AND 
    ADDTIME(CURDATE(), e.data_hora_saida)
);