


Meteor.startup(function () {
    // reset the state
    Viewport.remove({});
    Viewport.insert({});

    Meteor.publish("Viewport", function () {
        return Viewport.find();
    });

});
