Template.image.onRendered(function() {
    //console.log('onRendered');
    var element = this.$('div').get(0); // the element we will enabling with cornerstone to display images in
    var blockUpdate = false;// true if onImageRendered should update the global state

    // This function is called every time the cornerstone enabled element is drawn.  This event is fired when
    // the user interacts with the image (e.g. ww/wc, zoom, pan) so we hook it so we can update the global
    // state for other clients to sync to
    function onImageRendered(e, eventDat) {
        //console.log('CornerstoneImageRendered');
        // return immediately if we don't want to propogate this state update to other clients
        // NOTE: This mainly occurs when we are updating our internal state based on an update
        // from another client.  If we don't do this, updating our state will trigger an update
        // to the global state causing a circular loop
        if(blockUpdate === true) {
            return;
        }
        //console.log('updating global state');
        var viewport = cornerstone.getViewport(element);
        var vp = Viewport.findOne();
        Viewport.update({_id: vp._id}, {clientId: ClientId, viewport: viewport});
    }

    // we set an autorun function to be invoked every time the shared state is updated - that way we can
    // update our client side state to match
    function viewportAutoRun() {
        var viewport = Viewport.findOne();
        // handle special case where no viewport state has been set yet by returning immediately.  This happens
        // on server restart and the client initially connects
        if(!viewport.viewport) {
            return;
        }

        // ignore any changes to state that this client triggered
        if (viewport.clientId === ClientId) {
            //console.log('self update, ignoring');
            return;
        }

        // Another client modified the state, apply this new state and prevent us from triggering an update
        // to the shared state (to prevent circular loop)
        //console.log('external update');
        blockUpdate = true;
        cornerstone.setViewport(element, viewport.viewport);
        blockUpdate = false;
    };

    cornerstone.enable(element);
    var imageId = "example://1";
    cornerstone.loadImage(imageId).then(function(image) {
        var viewport = Viewport.findOne();
        //console.log(viewport);

        cornerstone.displayImage(element, image, viewport.viewport);
        cornerstoneTools.mouseInput.enable(element);
        cornerstoneTools.mouseWheelInput.enable(element);
        cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
        cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
        cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
        cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel

        $(element).on("CornerstoneImageRendered", onImageRendered);
        Tracker.autorun(viewportAutoRun);
    });
});

