import DateService from './dateService'

function STATS_ENPOINT(params) {
  let { botId, dimensions, granularity, dateFrom, dateTo } = params;

  dateFrom = DateService.toServerFormat(dateFrom);
  dateTo = DateService.toServerFormat(dateTo);

  return `http://localhost:3000/api/bots/buzz-data?bots=${botId}&dimensions=${dimensions}&granularity=${granularity}&from=${dateFrom}&to=${dateTo}`
}

function RANGE_ENPOINT(botId) {
  return `http://localhost:3000/api/bots/${botId}/stats-range`
}

export default {
  STATS_ENPOINT: STATS_ENPOINT,
  RANGE_ENPOINT: RANGE_ENPOINT
}
