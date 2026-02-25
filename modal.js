 allProducts=[ {
            "product_id": 36,
            "name": "Organic Lemons",
            "images": [
                "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400",
                "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400",
                "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
                "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400"
            ],
            "price": 2.49,
            "oldPrice": 3.49,
            "discount": 29,
            "rating": 4,
            "brand": "Nature's Best",
            "description": "Bright, zesty organic lemons perfect for cooking, baking, drinks, and dressings. Bursting with vitamin C.",
            "category": "Fruits",
            "unit": "Pack of 6",
            "weight": "600g",
            "organic": true,
            "stock": 120,
            "seller_id": "SLR-1",
            "dailySale": false,
            "monthSale": false,
            "reviews": [
                { "user_id": 106, "rating": 5, "comment": "Juicy and aromatic. Perfect for homemade lemonade!" },
                { "user_id": 107, "rating": 4, "comment": "Always fresh and zesty. A kitchen essential." },
                { "user_id": 108, "rating": 4, "comment": "Great for cooking and baking. Consistent quality." }
            ]
        },
        {
            "product_id": 37,
            "name": "Fresh Pineapple",
            "images": [
                "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400",
                "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400",
                "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400",
                "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400"
            ],
            "price": 3.99,
            "oldPrice": 5.49,
            "discount": 27,
            "rating": 5,
            "brand": "Tropical Bliss",
            "description": "Sweet and tangy golden pineapple, hand-selected for peak ripeness. Enjoy fresh, grilled, or in tropical smoothies.",
            "category": "Fruits",
            "unit": "Whole",
            "weight": "1.2 kg",
            "organic": false,
            "stock": 35,
            "seller_id": "SLR-5",
            "dailySale": false,
            "monthSale": true,
            "reviews": [
                { "user_id": 109, "rating": 5, "comment": "Perfectly ripe and so sweet! Great tropical flavor." },
                { "user_id": 110, "rating": 5, "comment": "Love grilling pineapple slices. This one was perfect." },
                { "user_id": 111, "rating": 4, "comment": "Juicy and delicious. Makes great piña coladas!" }
            ]
        },
        {
            "product_id": 38,
            "name": "Organic Red Apples",
            "images": [
                "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
                "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400",
                "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400",
                "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400"
            ],
            "price": 3.29,
            "oldPrice": 4.49,
            "discount": 27,
            "rating": 5,
            "brand": "Nature's Best",
            "description": "Crisp, sweet organic Fuji apples. Perfect for snacking, salads, baking, and juicing.",
            "category": "Fruits",
            "unit": "Bag of 6",
            "weight": "1 kg",
            "organic": true,
            "stock": 100,
            "seller_id": "SLR-1",
            "dailySale": true,
            "monthSale": false,
            "reviews": [
                { "user_id": 112, "rating": 5, "comment": "Crisp and sweet every time. My favorite snack apple!" },
                { "user_id": 113, "rating": 5, "comment": "These are perfect for my kids' lunchboxes." },
                { "user_id": 114, "rating": 4, "comment": "Great for apple pie. Always fresh and crunchy." }
            ]
        }]

        function showModal(productID){
            const product = allProducts.find(p => p.product_id === productID);
            document.images[0].src=product.images[0]
            document.getElementById("prod_modal").textContent='More About ' +product.name
            document.getElementById("prod_name").textContent=product.name;
            document.getElementById("prod_des").textContent=product.description;
        }

        showModal(36);