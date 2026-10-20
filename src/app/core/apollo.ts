import { inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { HttpLink } from 'apollo-angular/http';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';

import { environment } from '../../environments/environment';

const clientId = 'cid:' + Math.random() * Math.pow(10, 16);

/**
 * Factory for `provideApollo()`. Runs in an injection context.
 */
export function apolloOptions(): ApolloClient.Options {
  return {
    link: createServerLink(inject(HttpLink)),
    cache: new InMemoryCache(),
  };
}

function createServerLink(httpLink: HttpLink): ApolloLink {
  const http = httpLink.create({
    uri: `http://${environment.graphQLRoot}/graphql`,
    headers: new HttpHeaders({ clientid: clientId }),
    withCredentials: true,
  });

  /**
   * Speaks the `graphql-transport-ws` protocol served by `graphql-ws`'s `useServer()`.
   * `connectionParams` is exposed to the server's `onConnect` as `ctx.connectionParams`.
   */
  const ws = new GraphQLWsLink(
    createClient({
      url: `ws://${environment.graphQLRoot}/graphql`,
      connectionParams: { clientId },
      retryAttempts: Infinity,
      shouldRetry: () => true,
    }),
  );

  // Subscriptions go over the WebSocket, queries and mutations over HTTP
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === Kind.OPERATION_DEFINITION &&
        definition.operation === OperationTypeNode.SUBSCRIPTION
      );
    },
    ws,
    http,
  );
}
