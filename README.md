## 🧠 Project Tasks - Selfcheck points

<details>
<summary>✅ Completed</summary>

- [x] TASK 3: overall UI

- [x] TASK 6: warning for deadline nearings
- [x] TASK 10: switch to mongodb atlas? check if i should be having all the database stuff in compass ka localhost 120710 something or if it is better to have it connected to that VendorManagement thing that i created (maybe create a new one)
- [x] TASK 12: alright now, can you add a  button next to each of the accepted products, which says "make payment" along with an input text box. this text box should accept any amount thats equal to or lesser than the total price of the quantity of the same product bought. and on clicking on "make payment" it should ask the company to re-enter the password. if it is same, then it should make the transaction and keep track of how much is paid and how much needs to be paid next, and change the status from unpaid to partially paid and if at all the entire amount is paid then change it to paid.
- [x] TASK 13: IMPROVE THE UI UX ADD A LOT OF USER HELPFUL INTERACTIVE STUFF
- [x] TASK 17: check different ways for displaying the products, requests - catalogue? idk some scrolling animation - edit: carousel not catalogue lmao
- [x] TASK 18: check if background can be made better - colour grading and scheming
- [x] TASK 23: add reviews for products and vendors and companies - should be able to visit a particular vendor's/company's "profile"
- [x] TASK 25: so yes, images have been added (vendor side only, yet to implement company side). now comes creating new pages for viewing products, companies, vendors - individually.
- [x] TASK 28: check screenshot, there is an issue in showing the flipped side of the product card, the image shows up too, like a glitch in the matrix
- [x] TASK 29: the glitch is resolved, product cards are way smoother and better now
- [x] TASK 30: let's focus on other things - like the product card alternatives - look into where those stylish designs can be applied and the idea of each company/vendor/product having their own pages - all linked to each other - then after that comes star rating and reviews
- [x] TASK 31: remove redundacy from ProductManagement.module.css - and then merge with index4.css
- [x] TASK 32: this is done, i am now working on getting the ProductList.tsx to match the ProductManagement.tsx - regarding the display of the products in the grid - the hover card idea
- [x] TASK 33: note to self: add a buffer/loading thing whilst the new image/new product is being added to database.
- [x] TASK 34: upload ProductManagement, ProductList - new components and index5 onto git - done.
- [x] TASK 35: we shall add the loading/buffer thingy now.
- [x] TASK 36: after this should be getting each product their own page. every vendor. every company - when they visit own profile - edit option.
- [x] TASK 38: check if company side hover cards look okay? or maybe the grid size or the size of each hover card - hmmm
- [x] TASK 39: also, in the "uploading and creating..." - make that also change into "uploading and updating" or "uploading and creating" based on whether the new image is for updation or for creation.
- [x] TASK 42: done with buffer, going to create separate pages for products and vendor/company profiles i guess.
- [x] TASK 44: created the productdisplay page hoorayyy, it works - i gotta style it and stuff - later on. now, user display page??
- [x] TASK 45: niceeeee, vendor page display is done on companyside - next is company page display on vendorside
- [x] TASK 46: gotta modify so many codes on git tom morning - SO MCUH TO STYLE TOO - and make the products/users table contain more details.
- [x] TASK 47: reviews, star ratingssss. WOWWW company page display from vendors is done toooo! now only:
- [x] TASK 48: styling of UserDisplay.tsx ProductDisplay.tsx
- [x] TASK 49: make sure only logged in users can see other's profiles
- [x] TASK 50: edit profile option
- [x] TASK 52: reviews/star ratings
- [x] TASK 53: add that akon song that lucassfit used + that new thing/profile on consumerism
- [x] TASK 54: done with point 49. logged users (used authMiddleware.ts to implement protected routes)
- [x] TASK 55: now, profile edit option if its the same user
- [x] TASK 57: and then style the frontend
- [x] TASK 58: edit profile takes you to a diff page yes but now, i need a editprofile page - right?
- [x] TASK 59: YAYYY done with new profile page, new editprofile page - for all users. it shows any profile only if the person is logged into their account - and editprofile shows up only while displaying that user's details who is logged in currently
- [x] TASK 60: added a "go to dashboard" button to go back from the userdisplay page to the dashboard page.
- [x] TASK 61: "save changes" on editprofile will take user right back to userdisplay page.
- [x] TASK 63: so, done with point 3. Edit profile option
- [x] TASK 64: although all these changes have no ui-ux css styling right now, have to work on that. will do that before creating products page now.
- [x] TASK 66: INLINE PRODUCT CARD - EDIT DETAILS IS CRAZYYYY - IMPLEMENT IT FOR PRODUCT IMAGE ALSO, then you can remove the whole top part of the vendor dashboard - Create product can be the last productcard out of all the rest. last mai empty template for product creation.
- [x] TASK 67: done implementing for product image. i need to make the last part of the product cards gridlist into the create product option
- [x] TASK 68: yes, done with implementing the create product as the last product hover card in the gridlist. yayyy
- [x] TASK 69: the onclick field edit option - THIS REMAINS
- [x] TASK 70: user profile and product styles - for editing and viewing both
- [x] TASK 71: product page - reviews and star rating - YET TO ADD NEW FIELDS into schema
- [x] TASK 72: sort index.css out and merge the three module.css files - UHH LATER
- [x] TASK 73: OH THE MANUAL DEADLINE HAS NO CSS OR UIUX STUFF
- [x] TASK 74: onfield click edit option
- [x] TASK 75: manual deadline
- [x] TASK 78: modules done for the simpler, single use classnames - productrequests, paymentrequests, productmanagement, productlist - these are all put in one big remaining.css for further sorting on some other day i guess
- [x] TASK 79: there is an issue with who can see the product details - the reviews, comments - make it all public for logged in users.
- [x] TASK 80: modified multiple react_css into react_mui
- [x] TASK 82: onfield click edit option - not done yet
- [x] TASK 85: okay, the product display page looks too bad right now. ask it to maintain the theme, interactiveness, and colour and styling of the userdisplay and editprofile tsx files.
- [x] TASK 86: gotta MUI-fy the dashboard page too
- [x] TASK 88: gotta match the details/delete button for all the products with the green, purple thingy.
- [x] TASK 89: add go back to dashboard button after visiting the product page
- [x] TASK 90: inline editing UI is just too good now (except for image editing - will get back to this) - GOT BACK TO THIS FINALLY DONE.
- [x] TASK 91: double expandable hover cards are now multi-level expandable (depends on what fields of the product details you are editing)
- [x] TASK 92: auto-saving of product details when mouse leaves/stops hovering over the product card
- [x] TASK 93: MUI-fied CSS obviously
- [x] TASK 94: a lot of other small bugs, debugs wtv
- [x] TASK 96: NOTE TO SELF: read this readme file - find out what are the old/new to-do's - make a new list under this and start working one by one.
- [x] TASK 98: issues with the calendar (on non-net30 payments)
- [x] TASK 100: update image - better the ui
- [x] TASK 102: find out why the code is still looking for deleted products' ids - check backend product deletion logic?
- [x] TASK 103: add back to dashboard button on the productdetails page - add link to visit vendor profile from product details page
- [x] TASK 106: organise all the word docs into Incessantly.docx
- [x] TASK 108: on minimised screen, the price overflows out of the box - but name and desc dont.
- [x] TASK 109: on user details page - add a mailto link
- [x] TASK 110: user account deletion logic (cascaded) - lol, cru of user was there, no d until now eh4
- [x] TASK 111: move the star rating to under the product image
- [x] TASK 112: properly implement global redux for login - it uses a mix of tokens and cookies - double toast errors display
- [x] TASK 115: change what the "go back" button does, depending on which page was visited before it
- [x] TASK 117: reminder to modify the product display page such that the whitespace under the product image gets filled with something else...
- [x] TASK 118: clear password on wrong entry of password while trying to make payment, just like how it gets cleared on successful payment
make payment button does not have the glassmorphism
on vendor side - if payment has been cleared, remove amount due and deadlines
- [x] TASK 121: new idea, let deadline be, remove time left - on both, vendor and company side
- [x] TASK 123: collapsable "accepted"/"declined"/"pending" - which have a "number" of notification next to it - ideating how many "new" stuff are there in that category
- [x] TASK 127: add a view password option while login/signup, reenter password while signing up, edit password in the edit profile page (enter twice) - PARTLY DONE - editprofile page, not on the login-signup form.
- [x] TASK 128: WARNING TO SELF: time mismatch of the duration before the deadline at which the payment was cleared - difference in vendor, company side
- [x] TASK 129: rating button and review styles are very simple and are not user interactive - even for the vendor side (when he/she gives) and in general while viewing product details
- [x] TASK 131: profile photo for all users.
- [x] TASK 133: reconsider the "back to dashboard" -> "back to profile" -> edit profile - change the routing !!
- [x] TASK 136: translatex, translatey - make it go around the boxes - complete a round around the box and stay as a border - on hover.
- [x] TASK 139: remove compile errors from connectinglines.tsx
- [x] TASK 140: profile photo
- [x] TASK 142: password change option
- [x] TASK 143: infinite loop routing issue (dahsboard->profile->editprofile)
- [x] TASK 149: better the review giving UI
- [x] TASK 150: appearance of product/payment requests - annoying-slide-aall-the-way-to-the-bottom
- [x] TASK 161: implementing profile photo patch now: wait, let me think about where all this change will ripple into...
- [x] TASK 162: dashboard (profile button can be replaced with profile photo, same functionality onclick).
- [x] TASK 169: add styles to editprofile page
- [x] TASK 170: want dashboard to load with new username and deets after "save changes" from editprofile.
- [x] TASK 172: infinite loop - stacking pages - navigate -1
- [x] TASK 173: cant access the editprofile of another user directly, but if you copy paste url, it isnt protected. it lets any logged in user edit it.
- [x] TASK 175: break productmanagement into MORE COMPONENTS MAN its 1700 lines or something
- [x] TASK 176: CONNECTINGLINES.TSX - MAKE IT ERROR FREE.
- [x] TASK 177: combine paymentRequestsStyles-fromremainingcss.css along with PaymentRequests.tsx - and then resplit the styles. - understand what the buttonprops issue actually is. - COMBINATION DONE, RE-SPLITTING IS LEFT NOW.
- [x] TASK 180: first make the way all the requests come - side by side not one below the other - then do this.
- [x] TASK 183: stylise the tab interface for paymentrequests and implement the same for productrequests
- [x] TASK 187: if requests of a particular type are empty - display a message saying that
- [x] TASK 188: black button tab interface looks ugly highkey - modify it later.
- [x] TASK 190: unify the tab styling for payment and product requests pages - same import same styles.ts
- [x] TASK 193: small task: the order of appearance - accepted, pending, declined - is not the same for vendor - user - check if there should be different preferred orders for each or unify both?
- [x] TASK 194: create a new type of readme.md file - sort the priorities of the tasks, list the tasks currently being worked on, the tasks completed, and the ones that are pending need to have priorities.
- [x] TASK 198: display rating in vendor dashboard - product requests
- [x] TASK 199: display product image in company dashboard - payment requests
- [x] TASK 205: extract the reviewStyles and move it out and make new styles.ts file - import and reuse on both company and vendor sides
- [x] TASK 208: break the ExpandCard component further
- [x] TASK 217: ISSUE WITH PRODUCT CREATION AINNOWAY - NO PRODUCT IMAGE?! works on "update product image" tho - check backend routes - done, apparently random backend one-off issue
- [x] TASK 218: Hook Barrel: break useProductEditor.ts hook into its subcomponents
- [x] TASK 220: Reduce number of exports from expandCardStyles.ts
- [x] TASK 221: Hook Barrel: codesplit useProfileEditor.ts
- [x] TASK 222: Review and sort TASK 218'S Hook Barrel (Product Editor hooks) 
- [x] TASK 224: Export the login hook hooks/index.ts
- [x] TASK 225: Export the register hook hooks/index.ts
- [x] TASK 226: Redundant save-cancel styling in expandCardStyles.ts
- [x] TASK 227: Premature editing state activation: Image edit - onclick - it reloads preview before selecting image
- [x] TASK 229: Review for any leftover redundancy in expandCardStyles.ts
- [x] TASK 232: Faulty cancel button styles - expandCardStyles.ts
- [x] TASK 233: Center the character count + hint
- [x] TASK 236: Organisational - sort file structure - components vs pages, styles etc
- [x] TASK 237: Delete product confirmation modal - can be improved/stylised
- [X] TASK 239: Grid, Grid2, UnstableGrid - MUI-TS issues - resolve by using Box/Stack

</details>

<details>
<summary>🛠️ Needs Modification </summary>

- [ ] TASK 8: implement EEFM present worth, future worth, emi, interest schemes - give option for company to pay lesser amount now, or eventually pay larger amount over period of time - stuff like that - varied partial payments (NOTE: NET30 and pay earlier than 30 are the most sensible ones to implement for MSMEs, that too in india. look into these options though)  
- [ ] TASK 27: new flow for vendor's side. no longer are there two parts (product management and vendor requests). there is just product management (renamed to products) - where every product will have another "expandable" which upon expanding, expands into the list of companies that had requested for it, the current status of that request
- [ ] TASK 56: and then add more fields in product/user table/schema (like reviews and stars)
- [ ] TASK 122: vendor side could also show the star rating for each of the product requests

</details>

<details>
<summary>⚙️ Partially Done</summary>

- [ ] TASK 9: giving discounts and star ratings/credits for companies/vendors for keeping integrity.
- [ ] TASK 62: NOW whats left is productdisplay page and then ratings for products, and then eventually companies and vendors.
- [ ] TASK 76: vendor link in company dashboard
- [ ] TASK 83: vendor link in company dashboard - not done yet
- [ ] TASK 97: a lot of dev happened on vendor side, nothing much on company side - FUNNILY, the gap in the prod-desc box still does exist? lol
- [ ] TASK 101: cut stuff from reminaing.css that have no usage in any tsx file
- [ ] TASK 104: unify the mui styles thoughout the whole website - pick a colour theme and go by it, the buttons, the effects - YET TO DO
- [ ] TASK 107: switch to redux, reduxtoolkit instead of local state management
- [ ] TASK 125: again, these are all on vendor side - so, company side??
- [ ] TASK 134: REUSE COMPONENTS!!!!!! - STYLED BUTTONS, BOXES ETC - EZ PZ UNIFORMITY
- [ ] TASK 138. the dashboard onload curves - dont randomise maybe?
- [ ] TASK 163: show the pfp in displayuser and edit profile pages. and while showing product requests, payment requests.
- [ ] TASK 171: user display and editprofile must match styles, shape, structure - and editprofile's pfp+pw patch stands out (colours, effects)
- [ ] TASK 179: animate the underline of accepted requests/declined/pending - STARTED DOING THIS, A LOT OF SCOPE FOR ANIMATED IMPROV
- [ ] TASK 200: link to vendor's profile in company's payment requests section
- [ ] TASK 201: link to company's profile in vendor's product requests section
- [ ] TASK 207: reviewStyles.ts improv
- [ ] TASK 214: further simplify and disintegrate the remaining.css

</details>

<details>
<summary>🚧 Ongoing</summary>

- [x] TASK 95: YET TO Implement: features from ExpandProductCard onto AddProductCard
- [x] TASK 99: add new product card - edit features - expansion level bug + lack of features that updateproductcard has
- [x] TASK 137: component breaking down + reusability + better mui + module.css + unify the colour theming throughout the app
- [x] TASK 154: addproductcard ui from updateproductcard's
- [x] TASK 158: minimumprice limit in input/edit field of price
- [x] TASK 174: add product card vs edit product card
- [x] TASK 197: Make use of centralised axios - api.ts throughout the whole app
- [x] TASK 209: [ SAME AS TASKS - 95, 99, 154, 174, 235 ] after task 208, refer and stylise the AddProductCard component too
- [x] TASK 235: Add product card - kinda does look like the expandcard but its too long by default and products created when hovered also get too long
- [x] TASK 240: rename expandcard to updateproduct, addproductcard to createproduct - unify the styles

</details>

<details>
<summary>⏳ Yet to Start</summary>

- [ ] TASK 1: sort and filter the accepted product requests
- [ ] TASK 2: sort and filter the type of requests (based on products)
- [ ] TASK 4: payment gateway integration
- [ ] TASK 5: soonest payment first
- [ ] TASK 7: overdue payments
- [ ] TASK 11: i think, we can have individual payment requests ke liye ek ek button and then at the bottom of the page, we can have "all displayed payment requests" ko clear karne ke liye ek button and we can use filters and sort and stuff to change whats displayed on the page so we can kinda group the payments and pay in bulk.
- [ ] TASK 14: features like sort, and search/filter by vendor/company
- [ ] TASK 15: autoscroll to high priority payments, set priorities to payments (defaulting to the deadlines), but editable
- [ ] TASK 19: filter/search options
- [ ] TASK 20: company and vendor - total profits/total due/total income/total paid
- [ ] TASK 21: credit rating scores for companies and vendors
- [ ] TASK 22: add multiple images for the products - add more details for each product
- [ ] TASK 26: can add more metadata about all the products -
- [ ] TASK 40: https://www.theparisreview.org/blog/2019/07/16/the-crane-wife/
- [ ] TASK 41: https://press.uchicago.edu/ucp/books/book/chicago/A/bo209942751.html
- [ ] TASK 51: add more fields in product and user schemas
- [ ] TASK 65: gotta add more fields in user schema too.
- [ ] TASK 105: poem on cycle
- [ ] TASK 113: global home button
- [ ] TASK 114: MUI-fy the datepickermodal.module.css
- [ ] TASK 116: add more fields in the product and user tables - phone number, address for the user table; product table can include additional images
- [ ] TASK 124: notifications of payment requests, payments, product requests, new products, product deletion. NOTIFICATIONS WILL BE A HUGE UPGRADE
- [ ] TASK 126: what happens if deadline passes by?!
- [ ] TASK 130: filter products available by company, or when visiting vendor profile - show list of products
- [ ] TASK 132: consider cropping in 1:1 ratio not the landscape 2:3 - on main pages and the product page - should do. a crop feature while uploading, that shows them how itll be cropped and shown in square/circle
- [ ] TASK 135: user profile picture + eye icon->open image in new tab->DONT EXPOSE CLOUDINARY LINK + resize the images in hover product cards - WILL DO.
- [ ] TASK 141: multiple image products
- [ ] TASK 144: notifications
- [ ] TASK 145: home page button
- [ ] TASK 146: dont disclose cloudinary link
- [ ] TASK 147: image on display -> cropped/resized?
- [ ] TASK 148: filter products by vendors - like reviews can be filtered by companies
- [ ] TASK 151: payment? crypto? blockchain?
- [ ] TASK 152: delayed payments -> charges/fees/penalties -> deadline extension option when deadline nears (change from 24h to 48h)
- [ ] TASK 153: same product -> lend-borrow/buy-sell -> not just buy-sell
- [ ] TASK 155: clear blank/whitespaces -> add designs -> compactify
- [ ] TASK 156: chatbox option -> very similar to notifications
- [ ] TASK 157: complexify the user/product tables
- [ ] TASK 159: make reviews as a drop down or something - let it optionally occupy space
- [ ] TASK 160: instead of having separate edit profile page - allow editing inline - just like product mgmt
- [ ] TASK 164: BTW NONE of the payment requests - company side - show images of all the products.
- [ ] TASK 165: the pfp is optional - so the display should be the default empty profile image or whatever they pick (dont have to ask while signup)
- [ ] TASK 166: another idea as im implementing the pfp feature - a page to scroll thru all vendors and all companies - and then view their products.
- [ ] TASK 167: right now, its a products page - but we can have vendors page too. vendors page with filtering products vs products page with filtering vendors. filtering prices. filtering avg star ratings.
- [ ] TASK 168: delete old images - from cloudinary - after image updation.
- [ ] TASK 178: convert paymentRequestsStyles.ts into the other type of exporting? why is that not working??
- [ ] TASK 181: add loading screens instead of directly rendering some components by default
- [ ] TASK 182: add skeletons instead of loading screens
- [ ] TASK 184: tab interface the two parts of the dashboard too i guess.
- [ ] TASK 185: prompt user to add pfp if does nto exist
- [ ] TASK 186: make the underlines of the titles come auto animated after clicking on those tabs
- [ ] TASK 189: images of requested products not shown on company side - can compactify whole individual request card
- [ ] TASK 191: sort the requests by earliest deadline first, or by companies/vendors - give user the option of filtering.
- [ ] TASK 192: please work on 189 - compactification, rearrangement, expansion, etc now - PLEASE DO THIS
- [ ] TASK 195: an option to view the paid/cleared payment requests separately - tab interface again? inside of the accepted? OH OR MAYBE FILTER YES YES FILTER.
- [ ] TASK 196: prompt user to complete profile setup?
- [ ] TASK 202: the No rating found error - completed payment request which does not have a rating yet
- [ ] TASK 203: individual product requests page - have a compact list of all the product requests in the dashboard - or maybe expandable hover card types.
- [ ] TASK 204: check if the components like reviews and other details dont show false/wrong data while theyre actually loading - add loading screens or skeletons.
- [ ] TASK 206: check all the browser error logs and the the gap in the heading of the reiews - it will all be changed when i compactify stuff. this is first to do man! annd, the deprecated warnings and the migration upgrade errors.
- [ ] TASK 210: Payment integration - check UPI business, normal UPI
- [ ] TASK 212: Organisation account -> individual accounts -> for different sectors of the same org.
- [ ] TASK 213: Delete account option
- [ ] TASK 215: filter-search. notifications. compactification/expansification (add more details, remove more, hover-expand, new pages?)
- [ ] TASK 216: Check pinterest fintech colour theming etc
- [ ] TASK 219: Inline hover edit UI can be better - match colours and borders and hover effects of sliding from a side (airbnb)
- [ ] TASK 223: Consider converting ProductEditorHooks into a named export from hooks/index.ts
- [ ] TASK 228: the save/cancel buttons of inline editing -> the glossy matt style can be used on the tab interface of accepted/pending/declined - requests (the one that had the black colour style before)
- [ ] TASK 230: Reduce the hover area for each of the inline editing - make it smoother - merge backgorund color of the input with the product card or something
- [ ] TASK 231: Deploy app
- [ ] TASK 234: Delete Product Image functionality - right after uploading initially while creating product / while updating/editing the image details
- [ ] TASK 238: "Back to Dashboard" and "Back to Profile" Buttons exist on opposite sides - confusing. streamline. 

</details>

<details>
<summary>💡 Tips</summary>

- TASK 16: make sure any feature implemented on company side, also gets implemented on vendor side
- TASK 24: so i think it boils down to - adding more fields in the product schema - and enabling the viewing of vendor/company profiles – separate viewing of each product’s image(s) and rating/ reviews
- TASK 37: note to self: it is sometimes better to roll back into a previous version of your code, with lesser number of ideas having found implementation. But you know it’s a version that works. While developing, it is so crucial to have older versions of your code, and knowing when it is too late/too deep in a debug issue that started “after” you modified a safe version of your code and to roll back into this safer version and start over again. start afresh. Maybe re view your ideas that you wanted to implement, maybe its not that deep, maybe implement the same idea in a different way. But re start.
- TASK 43: its hard to decide if i have to create the separate products page first or the user details first create a universal users page, where only people who have logged in can see the other persons profile. sth like Instagram and then when you view your own profile, you'll have the edit profile option. maybe i should create the individual products' page first but where do the users click on to land there? should i end up modifying the current product expand/hover card style?
- TASK 77: index.css + 3 module.css files - note to self, the css files are getting too messy, i think module files are the way to go - that would reduce complexity but the number of css files would growwww;
- TASK 81: learnt about react+mui dependency issues
- TASK 84: also, gotta make some real app like tariq said - not some to do - also learn more on reducer, react, redux, states, refreshing, mgmt all that
- TASK 87: HMM, or MUI-fy the sub contents of the dashboard page, let'see - the dark theme is getting to me. lighter is kinda better
- TASK 211: what sets this app apart from the rest of them? what about the companies and vendors that 'meet' here but then proceed to have offline or irl or other modes of conversations? revenue model/source? who are vendors? who are companies? what can be sold, what can be bought? who monitors? rules and regulations? this app would fight against all the IT teams of all the individual organisations. this aims to streamline and consolidate and display the company's whole finance income-outcome-overtheday-past-futurescope - etc: modelled based on the namma yatri website: https://nammayatri.in/open - define what a product is. the dashboard should contain data analytics and insights type of details, not jump into productmgmt, or display, or payments. purchase/sales dept of organisations. 

</details>