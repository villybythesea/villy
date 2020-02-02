import * as React from "react"
import { client } from "./client"
import { ApolloProvider } from "@apollo/react-hooks"

export const wrapRootElement = ({ element }) => {
  return <ApolloProvider client={client}>{element}</ApolloProvider>
}
