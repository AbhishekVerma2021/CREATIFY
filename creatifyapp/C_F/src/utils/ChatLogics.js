export const getSender = (activeUser, users) => {
  return users[0]._id === activeUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, message, index, activeUserId) => {
  // console.log(index < messages.length);
  return (
    index < messages.length && // index of message should be less than messages Array length
    (messages[index + 1]?.sender._id !== message.sender._id // next message is not sent by the same sender
      || messages[index + 1]?.sender?._id === undefined) // next message is undefined
    && messages[index].sender._id !== activeUserId // current message is not logged in user
  );
};

export const isLastMessage = (messages, index, activeUserId) => {
  return (
    index === messages.length - 1 //index should be less than messages Array length
    && messages[messages.length - 1]?.sender._id !== activeUserId // last message shouldnot be from logged in user
    && messages[messages.length - 1]?.sender._id // last message should exist
  );
};