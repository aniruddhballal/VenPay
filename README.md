 # VenPay
HEAVILY (LEGIT MEAN IT) ramped up the 'VenPay0.0' Project

Currently, the UI-UX is VERY BAD - was working on developing the required functionalities.
Will update the frontend interface soon

# update: spent 4 days on the UI-UX - its decent now, interactive, convenient and smooth. i'll just update the files here now, but now i have a longer list of improv ideas for this project lol.

#Refer to the "list of improvements to do.txt" for diary like entries - so you can understand where this app plans to reach
# edit: i have appended the contents of the "list of improvements to do.txt" below (and deleted that file):

list of improvements to do (SOME ARE ALREADY implemented, the others arent yet)

(this whole .txt file is a NOTE TO SELF)

1. sort and filter the accepted product requests
2. sort and filter the type of requests (based on products)
3. overall UI
4. payment gateway integration
5. soonest payment first
6. warning for deadline nearings
7. overdue payments
8. implement EEFM present worth, future worth, emi, interest schemes - give option for company to pay lesser amount now,
or eventually pay larger amount over period of time - stuff like that - varied partial payments (NOTE: NET30 and pay earlier than 30
are the most sensible ones to implement for MSMEs, that too in india. look into these options though)
9. giving discounts and star ratings/credits for companies/vendors for keeping integrity.
10. switch to mongodb atlas? check if i should be having all the database stuff in compass ka localhost 120710 something
or if it is better to have it connected to that VendorManagement thing that i created (maybe create a new one)

i think, we can have individual payment requests ke liye ek ek button and then at the bottom of the page, we can have 
"all displayed payment requests" ko clear karne ke liye ek button.
and we can use filters and sort and stuff to change whats displayed on the page - so we can kinda group the payments and pay in bulk.

alright now, can you add a  button next to each of the accepted products, which says "make payment" along with an input text box.
this text box should accept any amount thats equal to or lesser than the total price of the quantity of the same product bought.
and on clicking on "make payment" it should ask the company to re-enter the password. if it is same, then it should make the
transaction and keep track of how much is paid and how much needs to be paid next, and change the status from unpaid
to partially paid and if at all the entire amount is paid then change it to paid.

done done, final things to implement are:
1. IMPROVE THE UI UX ADD A LOT OF USER HELPFUL INTERACTIVE STUFF
2. features like sort, and search/filter by vendor/company
3. autoscroll to high priority payments, set priorities to payments (defaulting to the deadlines), but editable
4. make sure any feature implemented on company side, also gets implemented on vendor side

updates as of 26th may, 2025:
1. check different ways for displaying the products, requests - catalogue? idk some scrolling animation - edit: carousel not catalogue lmao
2. check if background can be made better - colour grading and scheming
3. filter/search options
4. company and vendor - total profits/total due/total income/total paid
5. credit rating scores for companies and vendors
6. add images for the products - add more details for each product
7. add reviews for products and vendors and companies - should be able to visit a particular vendor's/company's "profile"

so i think it boils down to - adding more fields in the product schema - and enabling the viewing of vendor/company profiles - separate
viewing of each product
1. image(s)
2. rating, reviews

so yes, images have been added (vendor side only, yet to implement company side). now comes creating new pages for viewing products, companies, vendors - individually.
can add more metadata about all the products - 

new flow for vendor's side. no longer are there two parts (product management and vendor requests)
there is just product management (renamed to products) - where every product will have another "expandable" 
which upon expanding, expands into the list of companies that had requested for it, the current status of that request

check screenshot, there is an issue in showing the flipped side of the product card, the image shows up too, like a glitch in the matrix

the glitch is resolved, product cards are way smoother and better now

let's focus on other things - like the product card alternatives - look into where those stylish designs can be applied and the
idea of each company/vendor/product having their own pages - all linked to each other - then after that comes star rating and reviews

remove redundacy from ProductManagement.module.css - and then merge with index4.css
this is done, i am now working on getting the ProductList.tsx to match the ProductManagement.tsx - regarding the display of the products
in the grid - the hover card idea

note to self: add a buffer/loading thing whilst the new image/new product is being added to database.

upload ProductManagement, ProductList - new components and index5 onto git
done.

we shall add the loading/buffer thingy now.
after this should be getting each product their own page. every vendor. every company - when they visit own profile - edit option.

note to self: it is sometimes better to roll back into a previous version of your code, with lesser number of ideas having found implementation.
But you know it’s a version that works. While developing, it is so crucial to have older versions of your code,
and knowing when it is too late/too deep in a debug issue that started “after” you modified a safe version of your code 
and to roll back into this safer version and start over again. start afresh. Maybe re view your ideas that you wanted to
implement, maybe its not that deep, maybe implement the same idea in a different way. But re start.

check if company side hover cards look okay? or maybe the grid size or the size of each hover card - hmmm

also, in the "uploading and creating..." - make that also change into "uploading and updating" or "uploading and creating" based on whether
the new image is for updation or for creation.

https://www.theparisreview.org/blog/2019/07/16/the-crane-wife/
https://press.uchicago.edu/ucp/books/book/chicago/A/bo209942751.html


done with buffer, going to create separate pages for products and vendor/company profiles i guess.
its hard to decide if i have to create the separate products page first or the user details first
create a universal users page, where only people who have logged in can see the other persons profile. sth like instagram
and then when you view your own profile, you'll have the edit profile option.
maybe i should create the individual products' page first but where do the users click on to land there?
should i end up modifying the current product expand/hover card style?

created the productdisplay page hoorayyy, it works - i gotta style it and stuff - later on.
now, user display page??
niceeeee, vendor page display is done on companyside - next is company page display on vendorside
gotta modify so many codes on git tom morning - SO MCUH TO STYLE TOO - and make the products/users table contain more details.
UP NEXT: reviews, star ratingssss
WOWWW company page display from vendors is done toooo! now only:
1. styling of UserDisplay.tsx ProductDisplay.tsx
2. make sure only logged in users can see other's profiles
3. edit profile option
4. add more fields in product and user schemas
5. reviews/star ratings

6. add that akon song that lucassfit used + that new thing/profile on consumerism

done with point 2. logged users (used authMiddleware.ts to implement protected routes)
now, profile edit option if its the same user
and then add more fields in product/user table/schema (like reviews and stars)
and then style the frontend

edit profile takes you to a diff page yes but now, i need a editprofile page - right?

YAYYY done with new profile page, new editprofile page - for all users. it shows any profile only if the person is logged into
their account - and editprofile shows up only while displaying that user's details who is logged in currently
added a "go to dashboard" button to go back from the userdisplay page to the dashboard page. 
"save changes" on editprofile will take user right back to userdisplay page.

NOW whats left is productdisplay page and then ratings for products, and then eventually companies and vendors.
so, done with point 3.

although all these changes have no ui-ux css styling right now, have to work on that. will do that before creating products page now.
gotta add more fields in user schema too.

INLINE PRODUCT CARD - EDIT DETAILS IS CRAZYYYY - IMPLEMENT IT FOR PRODUCT IMAGE ALSO, then you can remove the whole top part of the
vendor dashboard - Create product can be the last productcard out of all the rest. last mai empty template for product creation.

done implementing for product image. i need to make the last part of the product cards gridlist into the create product option 

yes, done with implementing the create product as the last product hover card in the gridlist. yayyy
css styles to make better:
1. the onclick field edit option - THIS REMAINS
2. user profile and product styles - for editing and viewing both - THIS DONE
new idea to implement + css styles:
1. product page - reviews and star rating - YET TO ADD NEW FIELDS into schema - DONE
2. sort index.css out and merge the three module.css files - UHH LATER

OH THE MANUAL DEADLINE HAS NO CSS OR UIUX STUFF

left with styling of:
1. onfield click edit option
2. manual deadline - DONE
3. vendor link in company dashboard
4. index.css + 3 module.css files - note to self, the css files are getting too messy, i think module files are the way to go - that would reduce complexity but the number of css files would growwww;
modules done for the simpler, single use classnames - productrequests, paymentrequests, productmanagement, productlist - these are all put in one big remaining.css for further sorting on some other day i guess 

there is an issue with who can see the product details - the reviews, comments - make it all public for logged in users. - DONE
modified multiple react_css into react_mui
learnt about react+mui dependency issues

up next:
1. onfield click edit option - not done yet
3. vendor link in company dashboard - not done yet

also, gotta make some real app like tariq said - not some to do - also learn more on reducer, react, redux, states, refreshing, mgmt all that

okay, the product display page looks too bad right now. ask it to maintain the theme, interactiveness, and colour and styling of the userdisplay and editprofile tsx files.
gotta MUI-fy the dashboard page too

HMM, or MUI-fy the sub contents of the dashboard page, let'see - the dark theme is getting to me. lighter is kinda better

gotta match the details/delete button for all the products with the green, purple thingy.

add go back to dashboard button after visiting the product page

umm here's a small summary of all the updates on the productmanagement page:
1. inline editing UI is just too good now (except for image editing - will get back to this) - GOT BACK TO THIS FINALLY DONE.
2. double expandable hover cards are now multi-level expandable (depends on what fields of the product details you are editing)
3. auto-saving of product details when mouse leaves/stops hovering over the product card
4. MUI-fied CSS obviously
5. a lot of other small bugs, debugs wtv
TO SUMMARISE, crazy updation of the "updation process" lol
.
YET TO Implement: features from ExpandProductCard onto AddProductCard - THIS


NOTE TO SELF: read this readme file - find out what are the old/new to-do's - make a new list under this and start working one by one.

note ps:
1. a lot of dev happened on vendor side, nothing much on company side - FUNNILY, the gap in the prod-desc box still does exist? lol
2. issues with the calendar (on non-net30 payments) - DONE, RESOLVED!
3. add new product card - edit features - expansion level bug + lack of features that updateproductcard has
4. update image - better the ui
5. cut stuff from reminaing.css that have no usage in any tsx file
6. find out why the code is still looking for deleted products' ids - check backend product deletion logic?
7. add back to dashboard button on the productdetails page - add link to visit vendor profile from product details page
8. unify the mui styles thoughout the whole website - pick a colour theme and go by it, the buttons, the effects
9. poem on cycle
10. organise all the word docs into Incessantly.docx
DONE KINDA 11. switch to redux, reduxtoolkit instead of local state management - ONGOINGGG
DONE 12. on minimised screen, the price overflows out of the box - but name and desc dont. - DONE
DONE 13. on user details page - add a mailto link - DONE
DONE 14. user account deletion logic (cascaded) - lol, cru of user was there, no d until now eh4
DONE 15. move the star rating to under the product image
DONE 16. properly implement global redux for login - it uses a mix of tokens and cookies - double toast errors display
17. global home button
18. MUI-fy the datepickermodal.module.css
DONE 19. change what the "go back" button does, depending on which page was visited before it

20. add more fields in the product and user tables - phone number, address for the user table; product table can include additional images
DONE 21. reminder to modify the product display page such that the whitespace under the product image gets filled with something else...
DONE 22. clear password on wrong entry of password while trying to make payment, just like how it gets cleared on successful payment
DONE 23. make payment button does not have the glassmorphism
DONE 24. on vendor side - if payment has been cleared, remove amount due and deadlines
DONE, IMPLEMETED SOMETHING BETTER 25. new idea, let deadline be, remove time left - on both, vendor and company side
26. vendor side could also show the star rating for each of the product requests
27. collapsable "accepted"/"declined"/"pending" - which have a "number" of notification next to it - ideating how many "new" stuff are there in that category
28. notifications of payment requests, payments, product requests, new products, product deletion.
    NOTIFICATIONS WILL BE A HUGE UPGRADE
29. again, these are all on vendor side - so, company side??
30. what happens if deadline passes by?!
31. add a view password option while login/signup, reenter password while signing up, edit password in the edit profile page (enter twice)
DONE I GUESS 32. WARNING TO SELF: time mismatch of the duration before the deadline at which the payment was cleared - difference in vendor, company side
33. rating button and review styles are very simple and are not user interactive - even for the vendor side (when he/she gives) and in general while viewing product details

34. filter products available by company, or when visiting vendor profile - show list of products
35. profile photo for all users.

36. consider cropping in 1:1 ratio not the landscape 2:3 - on main pages and the product page

37. reconsider the "back to dahsboard" -> "back to profile" -> edit profile - change the routing !!
38. REUSE COMPONENTS!!!!!! - STYLED BUTTONS, BOXES ETC - EZ PZ UNIFORMITY
39. user profile picture + eye icon->open image in new tab->DONT EXPOSE CLOUDINARY LINK + resize the images in hover product cards

DONE 40. translatex, translatey - make it go around the boxes - complete a round around the box and stay as a border - on hover.

41. component breaking down + reusability + better mui + module.css + unify the colour theming throughout the app
42. the dashboard onload curves - dont randomise maybe?
43. remove compile errors from connectinglines.tsx
44. profile photo
45. multiple image products
46. password change option
47. infinite loop routing issue (dahsboard->profile->editprofile)
48. notifications
49. home page button
50. dont disclose cloudinary link
51. image on display -> cropped/resized?
52. filter products by vendors - like reviews can be filtered by companies
53. better the review giving UI
54. appearance of product/payment requests - annoying-slide-aall-the-way-to-the-bottom
55. payment? crypto? blockchain?
56. delayed payments -> charges/fees/penalties -> deadline extension option when deadline nears (change from 24h to 48h)
57. same product -> lend-borrow/buy-sell -> not just buy-sell
58. addproductcard ui from updateproductcard's
59. clear blank/whitespaces -> add designs -> compactify
60. chatbox option -> very similar to notifications
61. complexify the user/product tables
62. minimumprice limit in input/edit field of price
63. make reviews as a drop down or something - let it optionally occupy space
64. instead of having separate edit profile page - allow editing inline - just like product mgmt

implementing profile photo patch now: wait, let me think about where all this change will ripple into...
dashboard (profile button can be replaced with profile photo, same functionality onclick).
then displayuser and edit profile pages. and while showing product requests, payment requests.
BTW NONE of the payment requests - company side - show images of all the products.

the pfp is optional - so the display should be the default empty profile image or whatever they pick (dont have to ask while signup)

65. another idea as im implementing the pfp feature - a page to scroll thru all vendors and all companies - and then view their products.
right now, its a products page - but we can have vendors page too. vendors page with filtering products vs products page with filtering vendors.
filtering prices. filtering avg star ratings.

66. delete old images - from cloudinary - after image updation.
DONE DONE 67. add styles to editprofile page
DONE YAYYYY 68. want dashboard to load with new username and deets after "save changes" from editprofile.

69. user display and editprofile must match styles, shape, structure - and editprofile's pfp+pw patch stands out (colours, effects)

70. infitie loop - stacking pages - navigate -1
71. cant access the editprofile of another user directly, but if you copy paste url, it isnt protected. it lets any logged in user edit it.