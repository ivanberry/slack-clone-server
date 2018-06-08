export default `
  type Team {
    owner: User!
    memebers: [User!]!
    channels: [Channel!]!
  }
`;
