import { extendMoment } from "moment-range"
const Moment = require("moment")
const moment = extendMoment(Moment)

const yearlyPricing = {
  2020: {
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
  },
  2021: {
    double: {
      MAY: 48,
      JUNE: 60,
      JULY: 65,
      AUGUST: 65,
      SEPTEMBER: 60,
    },
    tripple: {
      MAY: 70,
      JUNE: 90,
      JULY: 98,
      AUGUST: 98,
      SEPTEMBER: 90,
    },
    apartment: {
      MAY: 95,
      JUNE: 120,
      JULY: 130,
      AUGUST: 130,
      SEPTEMBER: 120,
    },
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
        const yearOfReservation = moment(day).format("YYYY")
        const containsMay =
          moment(yearOfReservation)
            .month(4)
            .range("month")
            .contains(moment(day)) && "MAY"
        const containsJune =
          moment(yearOfReservation)
            .month(5)
            .range("month")
            .contains(moment(day)) && "JUNE"
        const containsJuly =
          moment(yearOfReservation)
            .month(6)
            .range("month")
            .contains(moment(day)) && "JULY"
        const containsAugust =
          moment(yearOfReservation)
            .month(7)
            .range("month")
            .contains(moment(day)) && "AUGUST"
        const containsSeptember =
          moment(yearOfReservation)
            .month(8)
            .range("month")
            .contains(moment(day)) && "SEPTEMBER"

        return (
          acc +
          yearlyPricing[yearOfReservation][room.room_type.room_type][
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
