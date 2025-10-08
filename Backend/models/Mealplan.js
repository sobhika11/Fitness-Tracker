const mongoose=require('mongoose');
const MealplanSchema=new mongoose.Schema({
    _id:{
        type:Number,
        required:true
    },
    food:{
        type:String,
        required:true
    },
    meal_type:{
        type:String,
        required:true
    },
    calories:{
        type:Number,
        required:true
    },
    protein:{
        type:Number,
        required:true
    },
    carbs:{
        type:Number,
        required:true
    },
    fat:{
        type:Number,
        required:true
    },
    serving_size:{
        type:String,
        required:true
    }
});
const mealplan=mongoose.model('Mealplan',MealplanSchema);
module.exports=mealplan;