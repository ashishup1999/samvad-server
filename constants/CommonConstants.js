const DB_COLLECTIONS = {
  USERS: "users",
  OTPS: "otps",
  CHATS: "chats",
};

const SOCKET_NAMES = {
  CONNECTION: "connection",
  USER_ACTIVE: "user_active",
  INFORM_USER_ACTIVE: "inform_user_active",
  SEND_MSG: "send_message",
  RECEIVE_MSG: "receive_msg",
  MSG_DELIVERED: "msg_delivered",
  MSG_SEEN: "msg_seen",
  CREATE_ROOM: "create_room",
  JOIN_ROOM:"join_room",
};

module.exports = { DB_COLLECTIONS, SOCKET_NAMES };
