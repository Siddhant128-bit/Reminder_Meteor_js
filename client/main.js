import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor'

import './main.html';

User=new Mongo.Collection('Users');

Todos = new Mongo.Collection('todos');
Template.todos.helpers({
    'todo': function(){
        return Todos.find({userid: Meteor.userId()});
    }
});

Template.addTodo.events({
    'submit form': function(event){
    event.preventDefault();
    var todoName = $('[name="todoName"]').val();
    Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date(),
        userid: Meteor.userId()
    });
    $('[name="todoName"]').val('');
  }
});

Template.todoItem.events({
  //delete action function
  'click .delete-todo': function(event)
  {
    event.preventDefault();
    var documentId = this._id;
    var confirm = window.confirm("Are you sure you want to delete this task?");
    if(confirm){
        Todos.remove({ _id: documentId });
    }
  },
  //if esc then exit the edit button function
  'keyup [name=todoItem]': function(event)
  {
      if(event.which == 13 || event.which == 27)
      {
          console.log("Esc Pressed");
          $(event.target).blur();
      } else
      {
          var documentId = this._id;
          var todoItem = $(event.target).val();
          Todos.update({ _id: documentId }, {$set: { name: todoItem }});
      }
  },
  //Checkbox for checking the completed or not completed action
  'change [type=checkbox]': function()
  {
    console.log("checkbox clicked at");
    var documentId = this._id;
    var isCompleted = this.completed;
    if(isCompleted){
        Todos.update({ _id: documentId }, {$set: { completed: false }});
        console.log("Task marked as incomplete.");
    } else {
        Todos.update({ _id: documentId }, {$set: { completed: true }});
        console.log("Task marked as complete.");
    }
  }
});
Template.todoItem.helpers({
    'checked': function(){
        var isCompleted = this.completed;
        if(isCompleted){
            return "checked";
        } else {
            return "";
        }
    }
});
//Helper function to count the total number of To Do
Template.CounterTodo.helpers({
    'All': function(){
        return Todos.find().count() //getting all the records in the To Do
    },
    'Done': function(){
        return Todos.find({ completed: true }).count(); //find all records where completed =True
    }
});

Template.register.events({
    'submit form': function(event)
    {
        event.preventDefault();
        var name= $('[name=name_user]').val();
        var number= $('[name=contact]').val();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser
        ({
            name:name,
            number:number,
            email: email,
            password: password
        });
        User.insert({
            name:name,
            number:number,
            email:email,
            password: password
        });
        Router.go('home');
    }
});
Router.route('/', {
  name: 'home', //so we can pass through it
  template: 'home'
});
Router.route('/register');
Router.route('/login');
Router.route('/Detail')
Router.configure({
    layoutTemplate: 'main'
});
//for logging in and logging out
Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();//logout the account and redirect to loggin page
        Router.go('login');
    }
});
//trying to loggin
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error)
          {
            console.log(error.reason);
            alert(error.reason);
          }
          else
          {
            Router.go("home");
          }
        });
    }
});

//image slider displaying information using owl caraousel
Template.informationReminder.onRendered(function() {
  $.getScript('owl.carousel.min.js').done(function() {
    $('.owl-carousel').owlCarousel({
      autoplay: 3000,
      loop: true,
      margin: 10,
      nav: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        1000: {
          items: 1
        }
      }
    });
  }).fail(function() {
    // do something here
    alert('Some form of error')
  });
});

//details page that gives the detail of the user information
Template.Detail.helpers({
  'Name': function(){
    return User.find({email: Meteor.users.findOne({ _id: Meteor.userId() }).emails[0].address}).fetch()[0].name;
  },
  'Number': function(){
    return User.find({email: Meteor.users.findOne({ _id: Meteor.userId() }).emails[0].address}).fetch()[0].number;
  },
  'Password': function(){
    return User.find({email: Meteor.users.findOne({ _id: Meteor.userId() }).emails[0].address}).fetch()[0].password;
  },
  'Email': function(){
      return  Meteor.users.findOne({ _id: Meteor.userId() }).emails[0].address;
  },

})
