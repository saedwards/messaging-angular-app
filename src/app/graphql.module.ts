import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClientOptions } from 'apollo-client';

const uri = 'http://localhost:4123/graphql'; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({
    uri,
    withCredentials: true
  });

  const ws = new WebSocketLink({
    uri: `ws://localhost:4123/graphql`,
    options: {
      reconnect: true
    }
  });

  // Using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link: ApolloLink = split(
    // split based on operation type
    ({ query }) => {
      let definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    ws,
    http,
  );

  const opts: ApolloClientOptions<any> = {
    link,
    cache: new InMemoryCache()
  };

  return opts;
}


@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
