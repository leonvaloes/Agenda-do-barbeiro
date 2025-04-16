
interface HorarioDia {
  entrada: Date;
  saida: Date;
}

interface HorariosPorSemana {
  segunda?: HorarioDia;
  terca?: HorarioDia;
  quarta?: HorarioDia;
  quinta?: HorarioDia;
  sexta?: HorarioDia;
  sabado?: HorarioDia;
  domingo?: HorarioDia;
}

interface associarHorariosAtendenteDto {
  idAtendente: number;
  horarios: HorariosPorSemana;
}
export default associarHorariosAtendenteDto;