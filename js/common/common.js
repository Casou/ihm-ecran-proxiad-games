let SERVER_URL = localStorage.getItem("serverUrl") || "http://localhost:8000/";
let WEBSOCKET_CLIENT;

$.ajaxSetup({
  headers: {'Authorization': 'adminToken'}
});

$(document).ready(() => {
  $("body").append(`<div id="loading"></div>`);
});

const showLoading = () => {
  $("#loading").show();
};
const hideLoading = () => {
  $("#loading").hide();
};

const makeid = (length = 9, onlyIntegers = false) => {
  let text = "";
  const possible = onlyIntegers ? "123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const lpad = (number, width = 2, character = '0') => {
  number = number + '';
  return number.length >= width ? number : new Array(width - number.length + 1).join(character) + number;
};

const parseJavaLocalDateTimeToJsDate = (javaLocalDateTime) => {
  if (Array.isArray(javaLocalDateTime)) {
    return new Date(javaLocalDateTime[0], javaLocalDateTime[1] - 1, javaLocalDateTime[2],
      javaLocalDateTime[3], javaLocalDateTime[4], javaLocalDateTime[5]);
  }

  const date = new Date(javaLocalDateTime);
  if (!isValidDate(date)) {
    throw new Error(`[${javaLocalDateTime}] cannot be parsed into date.`);
  }

  return date;
};

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

const ping = () => {
  const urlPing = SERVER_URL + "ping";
  return fetch(urlPing)
    .then(function (response) {
      console.debug("PING", response);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
    .catch(err => {
      console.error("Error while pinging server on " + urlPing, err);
      throw err;
    });
};

const checkMandatory = () => {
  showLoading();
  const allVoicesPromise = retrieveAllVoices();
  const pingPromise = ping()
    .then(() => {
      localStorage.setItem("serverUrl", SERVER_URL);
      if ($("#mandatory").length) {
        window.location.reload(false);
      }
    }).catch(() => {
      if (!$("#mandatory").length) {
        $("body").append(`
            <div id="mandatory" title="Serveur injoignable">
                <p>
                  Corriger l'adresse du serveur :
                  <input type="text" value="${SERVER_URL}" onChange="SERVER_URL = this.value; checkMandatory();" />
                  <br/>Le ping se fait lors du focus out.
                </p>
            </div>
        `);

        $("#mandatory").dialog({
          resizable: false,
          height: "auto",
          width: 600,
          modal: true,
          autoOpen: true
        });

        $("#message").hide();

        throw new Error("[checkMandatory] Ping to the server has failed");
      }
    }).finally(() => setTimeout(hideLoading, 0));

  return Promise.all([allVoicesPromise, pingPromise]);
};

const queuePromise = (promise, callback) => {
  if (!promise) {
    return new Promise(callback);
  }
  return promise.then(callback);
};


const getQueryParameters = () => {
  if (!window.location.search) {
    return []
  }
  const queryParamStrings = window.location.search.substring(1).split("&");
  const params = [];

  queryParamStrings.forEach(p => {
    const parts = p.split("=");
    params[parts[0]] = parts[1];
  });

  return params;
};