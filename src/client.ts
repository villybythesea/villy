import { ApolloClient, HttpLink, InMemoryCache, split, gql } from "apollo-boost"
import fetch from "isomorphic-fetch"
import { WebSocketLink } from "apollo-link-ws"
import ws from "ws"
import { getMainDefinition } from "apollo-utilities"
import { extendMoment } from "moment-range"
const Moment = require("moment")

const moment = extendMoment(Moment)

const wsForNode = typeof window === "undefined" ? ws : null

const wsLink = new WebSocketLink({
  uri: `${process.env.GATSBY_WS_URL}`,
  options: {
    reconnect: true,
  },
  webSocketImpl: wsForNode,
})

const httpLink = new HttpLink({
  uri: `${process.env.GATSBY_API_URL}`,
  fetch,
})

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)

const typeDefs = gql`
  extend type Query {
    capacity_check(arrival_date: String!, departure_date: String!): [Payload!]!
  }

  type Payload {
    id: String!
    room_number: String!
  }
`

const resolvers = {
  Query: {
    capacity_check: async (_, { arrival_date, departure_date }) => {
      const requestRange = moment.range(
        moment(arrival_date),
        moment(departure_date)
      )
      const {
        data: { room },
      } = await client.query({
        query: gql`
          query {
            room {
              id
              room_number
              reservation_rooms {
                reservation {
                  arrival_date
                  departure_date
                }
              }
            }
          }
        `,
      })
      const vacantRoomIds = room.reduce(
        (roomIds, { reservation_rooms, id, room_number }) => {
          const isReserved = reservation_rooms.some(({ reservation }) => {
            const reservationRange = moment.range(
              moment(reservation.arrival_date),
              moment(reservation.departure_date)
            )
            return requestRange.overlaps(reservationRange, { adjacent: true })
          })
          if (!isReserved) {
            return [...roomIds, { id, room_number }]
          }
          return roomIds
        },
        []
      )
      return vacantRoomIds
    },
  },
}

export const client = new ApolloClient({
  link,
  typeDefs,
  resolvers,
  cache: new InMemoryCache(),
})
