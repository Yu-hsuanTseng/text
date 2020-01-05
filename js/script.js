$(document).ready(function () {

  // INITIALIZE FIREBASE
  firebase.initializeApp({
    apiKey: "AIzaSyDxqDJlUXeW-AwfFgsRUAjIMWudhLyPLiQ",
    authDomain: "cheers-c52f7.firebaseapp.com",
    databaseURL: "https://cheers-c52f7.firebaseio.com",
    projectId: "cheers-c52f7",
    storageBucket: "cheers-c52f7.appspot.com",
    messagingSenderId: "466609031632",
    appId: "1:466609031632:web:99f1be21e319deabcf51d5",
    measurementId: "G-P8T46372LC"
  });

  // REFERENCE CHATROOM DOCUMENT
  let docRef = firebase.firestore()
    .collection("chatrooms")
    .doc("chatroom1");
  // REFERENCE CHATROOM MESSAGES
  let messagesRef = docRef
    .collection("messages");

  // QUERY MESSAGES BY TIMESTAMP ORDERING
  let queryRef = messagesRef
    .orderBy("timeStamp", "asc");

  // REGISTER DOM ELEMENTS
  const $cardHeader = $('#card-header');
  const $messageField = $('#message-field');
  const $nameField = $('#name-field');
  const $messageList = $('#message-list');

  // SET CHAT ROOM TITLE
  docRef.get().then(function (doc) {
    $cardHeader.html(doc.data().name);
  });

  // LISTEN FOR KEYPRESS EVENT
  $messageField.keypress(function (e) {
    if (e.keyCode == 13) {
      //FIELD VALUES
      let senderName = $nameField.val();
      let message = $messageField.val();

      //SAVE DATA TO FIREBASE
      messagesRef.add({
        "senderName": senderName, 
        "message": message,
        "timeStamp": Date.now()
        });

      // EMPTY INPUT FIELD
      $messageField.val('');
    }
  });

  // A RENDER SCREEN CALLBACK THAT IS TRIGGERED FOR EACH CHAT MESSAGE
  queryRef.onSnapshot(function (querySnapshot) {
    $messageList.html('');
    //MONITOR CHAT MESSAGE AND RENDER SCREEN
    querySnapshot.forEach(function(doc) {
      let senderName = doc.data().senderName || "anonymous";
      let message = doc.data().message;
      let messageItem = `
      <li class="message-item">
        <strong class="chat-username">${senderName}:</strong>
        ${message}
      </li>
      `;
      $messageList.append(messageItem);
    });

    //SCROLL TO BOTTOM OF MESSAGE LIST
    $messageList[0].scrollTop = $messageList[0].scrollHeight;
  });
});
