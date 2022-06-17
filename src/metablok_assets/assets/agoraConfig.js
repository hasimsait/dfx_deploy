const openButton = document.querySelector("#open-microphone-button");
const closeButton = document.querySelector("#close-microphone-button");
closeButton.classList.add("display-none");

const getToken = () => {
  axios
    .get("https://starfish-app-q2fq9.ondigitalocean.app/access_token?channelName=MetBlokDemo")
    .then((response) => {
      if (
        response &&
        response.status === 200 &&
        response.data &&
        response.data.token &&
        response.data.token !== ""
      ) {
        createClientAndJoinToChannel(response.data.token);
      }
    })
    .catch((error) => console.error(error));
};

getToken();

// Handle errors.
let handleError = function (err) {
  console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId) {
  // Creates a new div for every stream
  let streamDiv = document.createElement("div");
  // Assigns the elementId to the div.
  streamDiv.id = elementId;
  // Takes care of the lateral inversion
  streamDiv.style.transform = "rotateY(180deg)";
  // Adds the div to the container.
  remoteContainer.appendChild(streamDiv);
}

// Remove the video stream from the container.
function removeVideoStream(elementId) {
  let remoteDiv = document.getElementById(elementId);
  if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
}

const createClientAndJoinToChannel = (token) => {
  let client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  client.init(
    "bcdca462733441d789d2d1070de624fd",
    function () {
      console.log("client initialized");
    },
    function (err) {
      console.log("client init failed ", err);
    }
  ); // Join a channel
  client.join(
    token,
    "MetBlokDemo",
    null,
    (uid) => {
      let localStream = AgoraRTC.createStream({
        audio: true,
        video: false,
      });
      const muteAudio = function () {
        openButton.classList.add("display-none");
        closeButton.classList.remove("display-none");
        localStream._unmuteAudio();
      };
      const unmuteAudio = function () {
        closeButton.classList.add("display-none");
        openButton.classList.remove("display-none");
        localStream._muteAudio();
      };

      var body = document.getElementById("body");
      body.addEventListener("keypress", function (event) {
        if (event.key === "o" || event.key === "O") muteAudio();
        else if (event.key === "c" || event.key === "C") unmuteAudio();
      });
      openButton.onclick = muteAudio;
      closeButton.onclick = unmuteAudio;
      // Initialize the local stream
      localStream.init(() => {
        // Play the local stream
        localStream.play("me");
        // Publish the local stream
        client.publish(localStream, handleError);
        localStream._muteAudio();
      }, handleError);
    },
    handleError
  ); // Subscribe to the remote stream when it is published
  client.on("stream-added", function (evt) {
    client.subscribe(evt.stream, handleError);
  });
  // Play the remote stream when it is subsribed
  client.on("stream-subscribed", function (evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
  });
  // Remove the corresponding view when a remote user unpublishes.
  client.on("stream-removed", function (evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
  });
  // Remove the corresponding view when a remote user leaves the channel.
  client.on("peer-leave", function (evt) {
    let stream = evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
  });
  console.log(client);
};

