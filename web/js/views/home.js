window.HomeView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Home View');
        this.template = _.template(tpl.get('home'));
    },

    events:{
        "click #showMeBtn":"showMeBtnClick"
    },

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    showMeBtnClick:function () {
        app.headerView.search();
    }

});