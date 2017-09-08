# myapp


Endpoints:
=====================================================

1) Login
http://localhost:3000/api/v1/login
Method: POST
Input parameters: 
-----------------------
body:
userid
password

Return fields:
-----------------------
auth
token

2) Create User
http://localhost:3000/api/v1/user
Method: POST
Input parameters: 
-----------------------
body:
username
password
IsAdmin
profilePic
department
userid

Return fields:
-----------------------
username

3) Find Self
http://localhost:3000/api/v1/user
Method: GET
Input parameters: 
-----------------------
None

Return fields:
-----------------------
userid
username
isAdmin
profilePic
department

4) Update
http://localhost:3000/api/v1/user/999
Method: PUT
Input parameters:
-----------------------
url: userid

body:
username
password
IsAdmin
profilePic
department

Return fields:
-----------------------
userid
username
isAdmin
profilePic
department
password

5) Search
http://localhost:3000/api/v1/users?username=all&userid=0&page=1&limit=5
http://localhost:3000/api/v1/users?username=apple&userid=0&page=1&limit=5
http://localhost:3000/api/v1/users?username=all&userid=999&page=1&limit=5
Method: GET
Input parameters: 
-----------------------
username
userid
page
limit

Return fields:
-----------------------
list of docs

6) Delete
http://localhost:3000/api/v1/user/234
Method: DELETE
Input parameters:
-----------------------
url: userid

Return fields:
-----------------------
User: username was deleted.






