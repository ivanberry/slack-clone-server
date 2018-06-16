export default `
  type Team {
    id: Int!
    owner: User!
    name: String!
    memebers: [User!]!
    channels: [Channel!]!
  }

  type createTeamResponse {
    ok:Boolean!
    errors: [Error!]
  }

  type Query {
    allTeams: [Team!]!
  }

  type Mutation {
    createTeam(name: String!): createTeamResponse!
  }
`;
