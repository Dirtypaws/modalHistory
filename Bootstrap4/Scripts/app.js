var App = {};


// Modal
(function (app) {
    var mdl = $("#_modal");

    $("#modal_fwd").attr("disabled", true);

    function renderNavigation(history) {
        if (history == null || history.length === 1) {
            $("#modal_back").attr("disabled", true);
            $("#modal_fwd").attr("disabled", true);
            return;
        }

        var current = history.find(function(e) { return e.active; });

        var prev = history.find(function (ele) { return current.order > ele.order });
        var next = history.find(function (ele) { return ele.order > current.order });
        
        $("#modal_back").attr("disabled", prev == null);
        $("#modal_fwd").attr("disabled", next == null);
    }

    function addHistory(url) {
        var history = App.Session.Get("modalHistory");

        var max = 0;
        if (history != null && history.length > 0) {
            max = history.reduce(function (latest, maxOrder) {
                return maxOrder.order > latest.order ? maxOrder : latest;
            }).order + 1;
        } else {
            history = [];
        }

        for (var i = 0; i < history.length; i++) {
            history[i].active = false;
        }

        history.push({
            order: max,
            url: url,
            active: true
        });

        return App.Session.Set("modalHistory", history);
    }

    var open = function (url, mdlHistory) {
        if (url == null) {
            // TODO: Pnotify
            console.error("no url for modal specified");
            return;
        }

        var history = mdlHistory;
        if (!history)
            history = addHistory(url);

        mdl.load(url, function () { renderNavigation(history)});

        mdl.modal("show");
        mdl.modal("handleUpdate");
    };

    var close = function () {
        mdl.html("");
        mdl.modal("hide");
    };

    var back = function() {
        var history = App.Session.Get("modalHistory");

        var current = history.find(function (ele) {
            return ele.active;
        });

        var prev = history.find(function(ele) {
            return ele.order === current.order - 1;
        });

        current.active = false;
        prev.active = true;

        App.Session.Set("modalHistory", history);

        open(prev.url, history);
    };

    var forward = function () {
        var history = App.Session.Get("modalHistory");

        var current = history.find(function (ele) {
            return ele.active;
        });

        var next = history.find(function (ele) {
            return ele.order === current.order + 1;
        });

        current.active = false;
        next.active = true;

        App.Session.Set("modalHistory", history);

        open(next.url, history);
    };

    app.Modal = {
        Save: function () { return console.warn("No save method provided!"); },
        Open: open,
        Close: close,
        Back: back,
        Forward: forward
    }
}(App || {}));

// Session
(function (app) {

    var get = function (key) {
        var obj = sessionStorage.getItem(key);
        if (obj == null) return null;
        return JSON.parse(obj);
    }

    var set = function (key, obj) {
        sessionStorage.setItem(key, JSON.stringify(obj));
        return obj;
    }

    app.Session = {
        Get: get,
        Set: set
    }

}(App || {}));