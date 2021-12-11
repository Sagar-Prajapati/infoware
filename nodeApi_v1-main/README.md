# NodeJs task by Infoware

**Build B2B Multi-tenant eCommerce APIs**

1.development environment - NodeJs

2.database - Postgresql

3.Schema Builder - Knex

_note - schemas are avaliable in database folder in this same repo._

4.language used - Javascript ES6.

5.authentication - JWT(JsonWebToken)

# 1.For Owners\*\*

authorization - Bearer Token of JWT in every API

endpoints

**1.Register owner**

POST- /v1/owner/register

req body -
{
"name":"infoware admin",
"email":"admin@gmail.com",
"phone":"12345974",
"password":"admin",
"role":"admin"
}

**2.Owner login**

POST- /v1/owner/login

req body
{
"email":"admin@gmail.com",
"password":"admin"
}

**3.Add Products**

POST - /v1/owner/product

_consider category is already added._

req body
{  
 "name": "realme 3 pro",
"sku": "realme33",
"categoryId": 1,
"description": "new launched iphone",
"currency": "usd",
"unitPrice": "100"
}

**4.View Orders**

GET - /v1/orders

no req body only token nedded

# 2.For Customer\*\*

authorization - Bearer Token of JWT in every API

endpoints

**1.Add Account**

POST - /v1/customer/register

req.body
{
"name":"sagar prajapati",
"email":"sagar@gmail.com",
"phone":"1234561235",
"password":"qwerty",
"address":{
"streetAddress":"kkajshfol",
"locality":"ddsv",
"city":"vapi",
"postalCode":"789456",
"state":"gujarat",
"country":"India"
}
}

**2.Customer Login**

POST - /v1/customer/login

req body
{
"email":"sagar@gmail.com",
"password":"qwerty"
}

**3.Browse Products**

GET - /v1/products/browse?categoryId=2

product can be browse(filter and sort) by name,Category and ProductId specifing in query parameters.

**4.Order Products**

POST - /v1/orders

note that for this API, only 1 product with multiple quantity can be ordered in 1 order.

req body
{
"productId":1,
"customerId":1,
"addressId":1,
"quantity":10,
"discountApplied":10,
"totalAmount":500
}

**5.View Orders**

GET - /v1/customer/orders/{{customerId}}}

passing customer id as parameter

# Other Additional APIs

**1.Get All Products**

GET - /v1/products.

to get list of all products
