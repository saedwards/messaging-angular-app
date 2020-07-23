import gql from 'graphql-tag';
import conversationUserFragment from './conversation-user-fragment.gql';

export default gql`fragment conversationMessage on Message {
    id
    userId
    text
    fromYou
    timestamp
    user {
        ...conversationUser
    }
}
${conversationUserFragment}
`;
