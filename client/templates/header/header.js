Template.header.helpers({
    myClientId: function() {
        return ClientId;
    },
    clientId: function () {
        var vp = Viewport.findOne();
        if(vp === undefined) {
            return '';
        }
        return vp.clientId;
    }
});
