const RestaurantSchema = new mongoose.Schema({
    name: String,
    location: {
        lat: Number,
        lng: Number
    },
    foods: [
        {
            name: String,
            calories: Number,
            protein: Number,
            carbs: Number,
            fat: Number,
            meal_type: String
        }
    ]
});