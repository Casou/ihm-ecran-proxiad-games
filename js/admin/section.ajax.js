const retrieveRoomsData = () => {
    $.ajax({
        url: SERVEUR_URL + "users",
        type: "GET",
        success: (users) => {
            console.log('Success!');
            console.log(users);

            users.sort((a, b) => a.token.localeCompare(b.token));
            users.forEach(user => {
                new Section(user);
            })
        }
    });
};