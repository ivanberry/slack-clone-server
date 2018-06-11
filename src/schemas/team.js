export default `
  type Team {
    owner: User!
    memebers: [User!]!
    channels: [Channel!]!
  }

  type createTeamResponse {
    ok:Boolean!
    errors: [Error!]
  }

  type Mutation {
    createTeam(name: String!): createTeamResponse!
  }
`;
