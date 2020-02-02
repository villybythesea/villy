import { ApolloClient, HttpLink, InMemoryCache, split } from "apollo-boost"
import fetch from "isomorphic-fetch"
import { WebSocketLink } from "apollo-link-ws"
import ws from "ws"
import { getMainDefinition } from "apollo-utilities"

const wsForNode = typeof window === "undefined" ? ws : null

const wsLink = new WebSocketLink({
  uri: `ws://${process.env.GATSBY_API_URL}`,
  options: {
    reconnect: true,
  },
  webSocketImpl: wsForNode,
})

const httpLink = new HttpLink({
  uri: `http://${process.env.GATSBY_API_URL}`,
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

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
