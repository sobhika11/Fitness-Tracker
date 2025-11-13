const express=require('express');
const router=express.router();

router.post('/meals',(req,res)=>{
    const activityMap = new Map([
  ["Slightly active", 1.2],
  ["Lightly active", 1.375],
  ["Moderately active", 1.55],
  ["Very active", 1.725],
  ["Extra active", 1.9]
]);

    const { weight, height, age, gender, activityLevel, diet } = req.body;
    height=height/100
    const BMI=weight/(height*height);
    let BMR,TDEE
    let bal=200
    if(gender=='female')
        BMR = 10 * weight + 6.25 * height - 5 * age - 161
    else
        BMR = 10 * weight + 6.25 * height - 5 * age + 5
    TDEE = BMR * activityMap.get(activityLevel)
    res.json({BMI,BMR,TDEE})
    if(diet=='Calorie deficit')
    {
        TDEE-=500-200
        

    }

})
