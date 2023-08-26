const USER_QUERY = {
  GET_USERID: "SELECT user_id FROM USERS WHERE username=$1",
  GET_USER_BY_USERNAME: "SELECT * FROM USERS WHERE username=$1",
  GET_USER_BY_EMAIL: "SELECT * FROM USERS WHERE email=$1",
  GET_USER_BY_USERID: "SELECT * FROM USERS WHERE user_id=$1",
  ADD_USER:
    "INSERT INTO USERS (fullname,email,username, password) VALUES ($1, $2, $3, $4)",
  UPDATE_USERNAME: "UPDATE USERS SET username = $2 WHERE user_id = $1",
  UPDATE_FULLNAME: "UPDATE USERS SET fullname = $2 WHERE user_id = $1",
  UPDATE_EMAIL: "UPDATE USERS SET email = $2 WHERE user_id = $1",
  UPDATE_PASSWORD: "UPDATE USERS SET password = $2 WHERE user_id = $1",
  DELETE_USER: "DELETE FROM USERS WHERE user_id = $1",
  CREATE_OTP: "INSERT INTO OTP_TABLE (email, otp) VALUES ($1, $2)",
  GET_OTP: "SELECT otp FROM OTP_TABLE WHERE email = $1",
  UPDATE_OTP: "UPDATE OTP_TABLE SET otp = $2 WHERE email = $1",
};

module.exports = { USER_QUERY };
