
// The shared viewport state is managed through the Viewport subscription so we subscribe to it here and put a
// conditional in the HTML to only load the image template once the subscription is ready.  This is needed to
// prevent trying to display the image before we know what the current state is.  This strategy based on the
// the following stack overflow post:
// http://stackoverflow.com/questions/20942025/waiting-for-meteor-collection-to-finish-before-next-step

Template.imageContainer.onCreated(function() {
    this.subscribe("Viewport");
});

