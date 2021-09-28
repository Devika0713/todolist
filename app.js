const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Devika:test123@cluster0.vfcxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistDB", {
  useNewUrlParser: true
});

const itemsSchema = ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your new todo list!"
});

const item2 = new Item({
  name: "Click the + button to start adding"
});

const item3 = new Item({
  name: "make the best of today!"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log("Successfully inserted ")
  }
})


// let items = [];
// let workItems = [];

app.get("/", (req, res) => {
  var options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  var d = new Date()
  var today = d.toLocaleDateString("en-US", options);

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted ");
        }
      })
      res.redirect("/");
    } else {
      res.render("list", {
        title: today,
        newListItems: foundItems
      })
    }
 });
});

app.post("/", (req, res) => {
  let itemName = (req.body.newItem);

  const item = new Item({
    name: itemName
  });
  item.save();

  res.redirect("/");
});

app.post("/delete",(req,res)=>{
  const checkedItemID = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID,function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully inserted ");
    }
  })
  res.redirect("/");
  })
// app.get("/work", (req, res) => {
//   res.render("list", {
//     title: "Work",
//     newListItems: workItems
//   });
// });
//
// app.post("/work", (req, res) => {
//   let item = req.body.newItem;
//   workItems.push();
//   res.redirect("/work");
// });


app.listen(3000, () => {
  console.log("server is running");
});
