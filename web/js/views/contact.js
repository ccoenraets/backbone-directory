window.ContactView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Contact View');
        this.template = _.template(tpl.get('contact'));
    },

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }

});