window.ContactView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Contact View');
//        this.template = templates['Contact'];
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});