this.Documents = new Mongo.Collection("documents");
Categories = new Mongo.Collection("categories");


//////////////
/// Client ///
//////////////

if (Meteor.isClient) {

  // categories helper
  Template.categories.helpers({
    categories:function(){
      cat_curs = Categories.find();
      cat = cat_curs.fetch()
      for(i = 0; i < cat.length; i++) {
        documents = Documents.find({category:cat[i]._id}).fetch();
        cat[i].documents = documents
        console.log(cat[i]);
      }
      return cat;
    }
  });
}


//////////////
/// Server ///
//////////////


if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!Categories.findOne()){ // no documents yet!
      Categories.insert({category:"VoIP"})
      Categories.insert({category:"Snom"})
      Categories.insert({category:"WebRTC"})
    }
    if (!Documents.findOne()){ // no documents yet!
      category = Categories.findOne({category: "VoIP"})
      Documents.insert({title:"test VoIP", category:category._id})
      Documents.insert({title:"Natting", category:category._id})

      category = Categories.findOne({category: "Snom"})
      Documents.insert({title:"Snom720", category:category._id})
    }
  });
}
