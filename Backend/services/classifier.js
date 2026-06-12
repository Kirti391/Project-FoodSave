function classifyFood(data) {
    const food = data.food_type.toLowerCase().trim();
    const condition = data.food_condition.toLowerCase().trim();
    const category = data.food_category.toLowerCase().trim();
    const hours = parseInt(data.hours_old);

    // RAW FOOD DATASET

    const rawFoods = [

        // VEGETABLES

        'vegetables',
        'tomato',
        'potato',
        'onion',
        'carrot',
        'cabbage',
        'cauliflower',
        'broccoli',
        'spinach',
        'peas',
        'beans',
        'capsicum',
        'cucumber',
        'radish',
        'beetroot',
        'pumpkin',
        'ginger',
        'garlic',
        'lettuce',
        'okra',

        // FRUITS

        'fruits',
        'apple',
        'banana',
        'orange',
        'grapes',
        'mango',
        'papaya',
        'watermelon',
        'pineapple',
        'pear',
        'kiwi',
        'strawberry',
        'blueberry',
        'pomegranate',
        'guava',

        // RAW GRAINS / ITEMS

        'raw rice',
        'raw dal',
        'wheat',
        'flour',
        'oats',
        'corn',
        'millets'

    ];

    // COOKED FOOD DATASET


    const cookedFoods = [

        // INDIAN FOOD

        'rice',
        'fried rice',
        'jeera rice',
        'dal',
        'chapati',
        'roti',
        'naan',
        'paneer',
        'palak panner',
        'curry',
        'rajma',
        'khichdi',
        'biryani',
        'pulao',
        'idli',
        'dosa',
        'sambar',
        'poha',
        'upma',
        'pakora',
        'paratha',

        // FAST FOOD

        'pizza',
        'burger',
        'sandwich',
        'pasta',
        'noodles',
        'momos',
        'fries',
        'hotdog',

        // BAKERY

        'bread',
        'cake',
        'pastry',
        'cookies',
        'bun',

        // NON-VEG

        'chicken',
        'fish',
        'egg',
        'meat',
        'mutton'

    ];

    // DAIRY ITEMS

    const dairyFoods = [

        'milk',
        'curd',
        'yogurt',
        'cheese',
        'butter',
        'cream',
        'ice cream'

    ];

    // CHECK FOOD TYPES

    const isRawFood = rawFoods.some(f =>
        food.includes(f)
    );

    const isCookedFood = cookedFoods.some(f =>
        food.includes(f)
    );

    const isDairyFood = dairyFoods.some(f =>
        food.includes(f)
    );

    // HUMAN DONATION


    if (

        (
            isRawFood &&
            condition === 'fresh' &&
            hours <= 12
        )

        ||

        (
            isCookedFood &&
            condition === 'fresh' &&
            hours <= 4
        )

        ||

        (
            isDairyFood &&
            condition === 'fresh' &&
            hours <= 3
        )

    ) {

        return {

            classification: 'human',
            action: 'donate'

        };

    }

    // ANIMAL FEED

    if (

        (
            isCookedFood &&
            (
                condition === 'average' ||
                condition === 'fresh'
            ) &&
            hours <= 10
        )

        ||

        (
            isRawFood &&
            hours <= 24
        )

        ||

        (
            isDairyFood &&
            hours <= 6
        )

    ) {

        return {

            classification: 'animal',
            action: 'feed farm'

        };

    }

    // WASTE / COMPOST
    
    return {

        classification: 'waste',
        action: 'compost'

    };

}

module.exports = classifyFood;