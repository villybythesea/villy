import { extendMoment } from "moment-range"
const Moment = require("moment")
const moment = extendMoment(Moment)

const pricing = {
  double: {
    MAY: 40,
    JUNE: 46,
    JULY: 60,
    AUGUST: 60,
    SEPTEMBER: 50,
  },
  tripple: {
    MAY: 60,
    JUNE: 69,
    JULY: 90,
    AUGUST: 90,
    SEPTEMBER: 75,
  },
  apartment: {
    MAY: 90,
    JUNE: 92,
    JULY: 120,
    AUGUST: 120,
    SEPTEMBER: 100,
  },
}

export const useReservationCalc = ({ rooms, arrival_date, departure_date }) => {
  const start = moment(arrival_date)
  const end = moment(departure_date).endOf("day")

  const range = moment.range(start, end)

  const arrayOfDates = Array.from(range.by("days")).map(m =>
    m.format("YYYY-MM-DD")
  )

  const total = rooms.reduce((total, { room }) => {
    return (
      total +
      arrayOfDates.reduce((acc, day) => {
        const containsMay =
          moment()
            .month(4)
            .range("month")
            .contains(moment(day)) && "MAY"
        const containsJune =
          moment()
            .month(5)
            .range("month")
            .contains(moment(day)) && "JUNE"
        const containsJuly =
          moment()
            .month(6)
            .range("month")
            .contains(moment(day)) && "JULY"
        const containsAugust =
          moment()
            .month(7)
            .range("month")
            .contains(moment(day)) && "AUGUST"
        const containsSeptember =
          moment()
            .month(8)
            .range("month")
            .contains(moment(day)) && "SEPTEMBER"
        return (
          acc +
          pricing[room.room_type.room_type][
            containsMay ||
              containsJune ||
              containsJuly ||
              containsAugust ||
              containsSeptember
          ]
        )
      }, 0)
    )
  }, 0)
  const deposit = total - total * (1 - 0.35)
  return {
    total,
    deposit,
    nights: range.diff("days") + 1,
    balance: total - deposit,
  }
}
