import { ApolloClient, HttpLink, InMemoryCache, split } from "apollo-boost"
import fetch from "isomorphic-fetch"
import { WebSocketLink } from "apollo-link-ws"
import ws from "ws"
import { getMainDefinition } from "apollo-utilities"

const wsForNode = typeof window === "undefined" ? ws : null

const wsLink = new WebSocketLink({
  uri: "ws://localhost:8080/v1/graphql",
  options: {
    reconnect: true,
  },
  webSocketImpl: wsForNode,
})

const httpLink = new HttpLink({
  uri: `http://localhost:8080/v1/graphql`,
  fetch,
})

const link = split(
  // split based on operation type
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
