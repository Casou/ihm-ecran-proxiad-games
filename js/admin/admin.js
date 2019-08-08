let ROOMS = [];
let RIDDLES = [];
let RIDDLES_DATAS = [];

const showTab = (tab) => {
    $("#content > nav li").removeClass("active");
    $("#content > nav li[tab=" + tab + "]").addClass("active");

    $(".tab").hide();
    $("#" + tab).show();
};

$("#content > nav a").click(function() {
    showTab($(this).parent().attr("tab"));
});


const initWebSocket = () => {
    WEBSOCKET_CLIENT = new WebSocketClient(SERVER_URL + "ws", {}, initWebSocket);
    subscribeAll();
};

const subscribeAll = () => {
    subscribeRooms();
	subscribeRiddles();
};
