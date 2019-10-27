let ROOM_ID = null;
const OUTLINE_REGEX = /\*.\*/;
let PLAYER_PROFILES = [];

const init = () => {
  retrieveRoomsData()
    .then(rooms => {
      rooms.forEach(room => {
        $('select#rooms').append(`<option value="${room.id}">${room.name}</option>`)
        if (ROOM_ID) {
          $('select#rooms').val(ROOM_ID).change();
        }
      });
    });
};

const retrieveRoomsData = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: SERVER_URL + "room",
      type: "GET",
      success: (rooms) => {
        resolve(rooms);
      },
      error: (xmlHttpRequest, textStatus, errorThrown) => {
        console.error("Status: " + textStatus);
        console.error("Error: " + errorThrown);
        reject(textStatus);
      }
    });
  });
};

const changeRoom = roomId => {
  window.history.pushState("", "", "?roomId=" + roomId);
  PLAYER_PROFILES = [
    {id: 354351534, name: 'Testeur *f*ou'},
    {id: 83743654, name: 'Coach agile Wa*t*erfall'},
    {id: 5735438, name: 'Dévelop*p*eur novice'},
    {id: 64341350, name: 'PO drog*u*é au café'},
    {id: 5435035, name: 'Chef de proj*e*t paniqué'},
    {id: 254214235, name: 'Scrum M*y*stère'}
  ];
  generateBadges();
};

const generateBadges = () => {
  $('main').html(PLAYER_PROFILES.map(profile => {
    let name = profile.name;
    const match = name.match(OUTLINE_REGEX);
    if (match) {
      const letter = match[0].substring(1, 2);
      name = profile.name.replace(OUTLINE_REGEX, `<span class='outline'>${letter}</span>`);
    }

    return `
        <article class="badge" id="badge_${profile.id}">
            <section class="job">
                <input type="text" class="hidden" value="${profile.name}" onBlur="applyBadgeEdit(${profile.id}, this.value)" />
                <p onClick="editBadge(${profile.id});">${name}</p>
            </section>
        </article>`
  }).join(""))
    .append(`
        <article class="badge add" onClick="addBadge()"><div>+</div></article>`);
};

const addBadge = () => {
  PLAYER_PROFILES.push({id: parseInt(makeid({onlyIntegers: true})), name: '*N*ouveau'});
  generateBadges();
};

const editBadge = badgeId => {
  $(`#badge_${badgeId} p`).addClass("hidden");
  $(`#badge_${badgeId} input`).removeClass("hidden").focus();
};

const applyBadgeEdit = (id, name) => {
  PLAYER_PROFILES.find(p => p.id === id).name = name;
  generateBadges();
};

const changeOrientation = orientation => {
  $('main').attr("class", orientation);
};

init();

const queryParams = getQueryParameters();
if (queryParams.roomId) {
  ROOM_ID = queryParams.roomId;
}