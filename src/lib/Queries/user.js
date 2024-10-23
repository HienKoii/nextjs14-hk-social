export const userInfoSql = `
   SELECT id, email, username , fullName , avatar , background, tick, biography FROM users WHERE id = ?
`;
