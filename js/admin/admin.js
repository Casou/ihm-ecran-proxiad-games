let ROOMS = [];
let RIDDLES = [];
let RIDDLES_DATAS = [];

const showTab = (tab) => {
  $("#content > nav li").removeClass("active");
  $("#content > nav li[tab=" + tab + "]").addClass("active");

  $(".tab").hide();
  $("#" + tab).show();
};

$("#content > nav a").click(function () {
  showTab($(this).parent().attr("tab"));
});


const initWebSocket = () => {
  $('#connected_server_icon').html('wifi_off').addClass('disconnected');
  WEBSOCKET_CLIENT = new WebSocketClient(SERVER_URL + "ws", {}, initWebSocket, notifyConnectToServer);
  subscribeAll();
};

const notifyConnectToServer = () => {
  $('#connected_server_icon').html('wifi').removeClass('disconnected');
};

const subscribeAll = () => {
  subscribeRooms();
  subscribeRiddles();
};
