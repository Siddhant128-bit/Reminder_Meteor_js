import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Todos = new Mongo.Collection('todos');
  User=new Mongo.Collection('Users');
});
Router.route('/', {
  template: 'home'
});
Router.route('/register');
Router.route('/login');
Router.configure({
    layoutTemplate: 'main'
});
Router.route('/Detail');
