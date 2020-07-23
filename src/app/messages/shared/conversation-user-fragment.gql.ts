import gql from 'graphql-tag';

export default gql`fragment conversationUser on User {
    id
    name
    colour
    avatarUrl
}`;
