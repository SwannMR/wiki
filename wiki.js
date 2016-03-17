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

  Template.addNewDocumentModal.helpers({

    categories:function(){
      return Categories.find();
    }
  });

  Template.editor.helpers({

      "editorOptions": function() {
          return {
              lineNumbers: true,
              lineWrapping: true,
              mode: "markdown"
          }
      },

      "document": function() {
          return "Code to show in editor";
      }
  });

  

//////////////
/// Events ///
//////////////

  Template.addNewDocumentModal.events({
    'submit .js-add-doc':function(event){
      event.preventDefault(); //stop a document from getting created when reload occurs
      if (Meteor.userId()){
        docTitle = event.target.documentTitle.value;
        category = Categories.findOne({category:event.target.category.value});
        if (category){
          Documents.insert({title:docTitle, category:category._id});
          $( '#new-document-modal' ).modal( 'hide' );
          $( '.modal-backdrop' ).remove();
        }
      }
      else{
        console.log("failed");
      }


    }
  })


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
