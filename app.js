const express = require("express");
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose = require('mongoose')

const app= express();

app.set('view engine',ejs);
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser:true, useUnifiedTopology: true});

const articleSchema ={
    name:String,
    love:String
};

const collec =mongoose.model("article",articleSchema);



app.route("/articles")

.get(function(req,res){
    collec.find(function(err,doc){
        if(!err){
            res.send(doc);
        }
    })
 })

  .post(function(req,res){
    docTitle=req.body.name;
   docContent= req.body.love;
   
   const doc =new collec({
        name:docTitle,
        love:docContent
   });
   doc.save(function(err){
       if(!err){
        res.redirect("/articles");
       }
       else{
           res.send(err);
       }
   });

  })
  
 .delete(function(req,res){
      collec.deleteMany(function(err){
        if(!err){
            res.send("deleted successfully all articles");
        }
    })
});



app.route("/articles/:names")


 .get(function(req,res){
     collec.findOne({name:req.params.names},function(err,doc){
         if(!err){
             res.send(doc);
         }
         else{
             res.send("error")
         }
     })
 })

  .put(function(req,res){
      collec.update(
          {name:req.params.names},
          {name:req.body.name,love:req.body.love},
          {overwrite:true},
          function(err,result){
              if(!err){
                  res.send("successfully updated");
              }
          })
        
  })
 .patch(function(req,res){
    collec.update(
        {name:req.params.names},
        {$set:req.body},
        function(err,doc){
            if(!err){
                res.send("succesfully updated the article specified");
            }else{
                res.send(err);
            }
        }

    )
 })
  .delete(function(req,res){
    collec.deleteOne({name:req.params.names},function(err){
        if(!err){
            res.send("deleted successfully all specified article");
        }
    })

  })




app.listen(3000,function(){
    console.log("server is ready");
})