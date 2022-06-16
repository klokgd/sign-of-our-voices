$("#city").suggestions({
    token: "d3fb294eccdfc34fa42014ec1843052a588dd1a2",
    type: "ADDRESS",
    bounds: "city",
    /* Вызывается, когда пользователь выбирает одну из подсказок */
    onSelect: function(suggestion) {
        console.log(suggestion);
        $("#isCorrectCity").val("true");
    },
    onSelectNothing: function() {
        $("#result").text("Не выбрана ни одна подсказка.");
        $("#isCorrectCity").val("false");
    }
});

