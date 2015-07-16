import moment from 'moment';

const DateService = {
  toServerFormat: (date) => {
    return moment(date).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z' //ISO 8601
  },

  toDisplayFormat: (date) => {
    return moment(date).utc().format('YYYY-MM-DDTHH:mm:ss')
  }
}

export default DateService
