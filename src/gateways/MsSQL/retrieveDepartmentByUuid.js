import mssql from "mssql";

export default ({ getMsSqlConnPool }) => async (uuid) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("uuid", mssql.UniqueIdentifier, uuid)
    .query(
      "SELECT id, uuid, name, code, status, facility_id FROM dbo.[department] WHERE uuid = @uuid"
    );
  return res.recordset[0];
};
