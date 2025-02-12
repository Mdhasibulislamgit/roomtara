const Review = require("./review");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultImage ="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
    title:{ type: String, },
    description: String,
    image: {
        type:String,
        default: defaultImage,
        set:(v)=> v === "" ? defaultImage : v,
    },
    price: Number,
    location: String,
    country: String,
    
    //add reviews array
    reviews:{
        type: [Schema.Types.ObjectId],
        ref: "Review",
    }
});

//remove reviews with parent 

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }); //$in means in array of ids 
    }
    
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


