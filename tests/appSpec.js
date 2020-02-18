const TEST_ITEMS = ['Caffè Americano'];
const TEST_PRICES = [180];
const TEST_ITEM = [1,'Caffè Americano',180];
const TEST_CART_ITEM = [{ 
    'id' :1,
    'name' : 'Caffè Americano',
    'image' : '../assets/product-1.png',
    'price' : 180
},
{ 
    'id' :2,
    'name' : 'Cappuccino',
    'image' : '../assets/product-2.png',
    'price' : 200
}];

let HTMLElements = {};
document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function (ID) {
    if (!HTMLElements[ID]) {
        var newElement = document.createElement('div');
        HTMLElements[ID] = newElement;
    }
return HTMLElements[ID];
});

function isElement(element) {
    return element instanceof Element || 
    element instanceof HTMLDocument;
}


// Trial 1 - Create a class for menu Item
describe('Create menu item', function(){

    beforeEach(function(){
        item = new MenuItem(...TEST_ITEM);
    });

    describe('Contruction of a menu item', function(){

        beforeEach(function(){
            keys = Object.keys(item);
        });

        it('should create a valid MenuItem object\
        given id,name and price', function(){
            expect(item).toBeInstanceOf(MenuItem);
        });

        it('should create an menu item with valid name\
        ',function(){
            let found = keys.findIndex(key => key == 'name');
            let expectedName = TEST_ITEM[1];
            expect(found).toBeGreaterThan(-1);
            expect(item.name).toBeInstanceOf(String);
            expect(item.name).toBe(expectedName);
        });

        it("should create menu item with a valid image url\
        ", function () {
            let found = keys.findIndex(key => key == 'image');
            expect(found).toBeGreaterThan(-1);
            expect(item.image).toBeInstanceOf(String);
            expect(item.image.substring(3,)).
            toMatch(/assets\/product-[0-9]+\.png/);
        });
        
        it("should create menu item with a valid price\
        ", function () {
            let found = keys.findIndex(key => key == 'price');
            let expectedPrice = TEST_ITEM[2];
            expect(found).toBeGreaterThan(-1);
            expect(item.price).toBeInstanceOf(Number);
            expect(item.price).toBe(expectedPrice);
        });
    });

    describe('View MenuItem',function(){

        beforeEach(function(){
            menuItem = item.getItem();
        });

        it('should return a HTML element', function(){
            expect(isElement(menuItem)).toBeTrue();
        })
    
        it('should return a HTML element with\
        "item" css class',function(){
            expect(menuItem).toHaveClass('item');
        })
    
        it('should return HTML element with\
        "data-id" as attribute', function () {
            let hasAttribute = menuItem.hasAttribute('data-id');
            expect(hasAttribute).toBeTrue();
        });
    
        it("should append valid image to\
        'item' element ", function () {
            let img = menuItem.children[0];
            let img_src = img.getAttribute('src');
            expect(img_src.substring(3,)).
            toBe('assets/product-1.png');
        });
    });
});

// Trial 2 - Create a class for menu
describe('Create Menu', function(){

    beforeEach(function(){
        menu = new Menu(TEST_ITEMS,TEST_PRICES);
    });

    describe('Construction of Menu', function(){

        beforeEach(function(){
            items = menu.items;
        });

        it('should create a valid menu object given\
        items and prices array', function(){
            expect(menu).toBeInstanceOf(Menu);
        });

        it('should create an array of items', function(){
            expect(items[0]).toBeInstanceOf(MenuItem);
        });

        it('should create equal number of items for\
        given item names and prices', function(){
            let expectedLength = TEST_ITEMS.length;
            expect(items.length).toBe(expectedLength);
        });
    });


    describe('View Menu', function(){

        beforeEach(function(){
            fragment = menu.displayCatalogue();
        });

        it('should return array of HTML elements\
        ', function(){
            expect(isElement(fragment[0])).toBeTrue();
        });

        it('should create equal number of HTML \
        elements for given item names \
        and prices', function(){
            let expectedLength = TEST_ITEMS.length;
            expect(fragment.length).toBe(expectedLength);
        });
    });

    // Trial 3 - Add item to cart
    describe('Add items to cart', function(){

        beforeEach(function(){
            fragment = menu.displayCatalogue();
            list = menu.addToCart(fragment[0]);
        });

        it('should add valid item to cart \
        ', function(){
            expect(list[0]).toBeInstanceOf(CartItem);
        });

        it('should return an updated cart list\
        ', function(){
            expect(list.length).toBe(1);
        });
    });

    describe("Search items", function(){
        beforeEach(function(){
            menu = new Menu([
                'Salted Caramel',
                'Hot Chocolate',
                'Hibiscus Lemonade'],
                PRICE);
            result = menu.searchItems("c");
        });

        // Challenge 1 - search for items
        it('should return a array of items matching\
        the search keyword', function(){
            expect(result.length).toBe(3);
        });

        // Challenge 2 - sort search result
        it('should return an array in sorted\
        order', function(){
            expectedArray = [
                "Hibiscus Lemonade", 
                "Hot Chocolate", 
                'Salted Caramel'
            ];
            expect(result).toEqual(expectedArray);
        });
        
    });

});

// Trial 4 - Create a class for cart
describe('Create Cart', function(){

    beforeEach(function(){
        cart = new Cart();
    });

    describe('Construction of Cart', function(){

        beforeEach(function(){
            keys = Object.keys(cart);
        });

        it('should create a valid cart object\
        ', function(){
            expect(cart).toBeInstanceOf(Cart);
        });

        it('should create a cart with valid empty\
        list array', function(){
            let found = keys.findIndex(key => key == 'list');
            expect(found).toBeGreaterThan(-1);
            expect(cart.list).toBeInstanceOf(Object);
        });

        it('should create a cart with valid variable\
        total initilaized with zero', function(){
            let found = keys.findIndex(key => key == 'total');
            expect(found).toBeGreaterThan(-1);
            expect(cart.total).toBeInstanceOf(Number);
        });
    });


    describe('View Cart', function(){

        beforeEach(function(){
            fragment = cart.displayCart();
        });

        it('should return an array of HTML\
         elements for cart', function(){
            expect(fragment).toBeInstanceOf(Object);
        });

        it('should return an array of HTML\
        elements of length six', function(){
           expect(fragment.length).toBe(6);
       });
    });

    // Trail 5 - Check whether item is present in cart
    describe('Check for cart item availability', function(){
        it('should return the cart item if\
        present in the cart',function(){
            cart.list.push(new CartItem(TEST_CART_ITEM[0]));
            let availability = cart.checkAvailability(1);
            expect(availability).toBeInstanceOf(CartItem);
        });
    });

    // Trial 6 - Increment cart item quantity
    describe('Increment the quantity\
    ', function(){

        beforeEach(function(){
            cart.list.push(new CartItem(TEST_CART_ITEM[0]));
            fragment = cart.displayCart();
        });

        it('should return an updated list\
        ', function(){
            let updatedList = cart.
            handleIncrementClick(fragment[3].children[1]);
            expect(updatedList).toBeInstanceOf(Object);
        });

        it('should return an updated list with\
        increment in quantity', function(){
            let expectedQuantity = cart.list[0].quantity + 1;
            let updatedList = cart.
            handleIncrementClick(fragment[3].children[1]);
            expect(updatedList[0].quantity).toBe(expectedQuantity);
        });

        it('should return an updated list with\
        increment in total', function(){
           let expectedTotal = cart.list[0].total + cart.list[0].price;
           let updatedList = cart.
           handleIncrementClick(fragment[3].children[1]);
           expect(updatedList[0].total).toBe(expectedTotal);
       });
    });

    // Trail 7 - Decrement cart item quantity
    describe('Decrement the quantity', function(){

        beforeEach(function(){
            cart.list.push(new CartItem(TEST_CART_ITEM[0]));
            fragment = cart.displayCart();
            cart.handleIncrementClick(fragment[3].children[1]);
        });

        it('should return an updated list\
        ', function(){
            let updatedList = cart.
            handleDecrementClick(fragment[3].children[1]);
            expect(updatedList).toBeInstanceOf(Object);
        });

        it('should return an updated list with\
        decrement in quantity', function(){
            let expectedQuantity = cart.list[0].quantity - 1;
            let updatedList = cart.
            handleDecrementClick(fragment[3].children[1]);
            expect(updatedList[0].quantity).toBe(expectedQuantity);
        });

        it('should return an updated list with\
        decrement in total', function(){
            let expectedTotal = cart.list[0].total - cart.list[0].price;
            let updatedList = cart.
            handleDecrementClick(fragment[3].children[1]);
            expect(updatedList[0].total).toBe(expectedTotal);
       });
    });

    // Trail 8 - Remove item from cart
    describe('Remove item from cart\
    ',function(){

        beforeEach(function(){
            TEST_CART_ITEM.forEach(item =>
                cart.list.push(new CartItem(item)));
            fragment = cart.displayCart();
            expectedList = cart.list.filter(item => 
                item.id !== 2);
            updatedList = cart.
            handleRemoveClick(fragment[3].children[2]);
        });

        it('should return an updated cart list\
        ',function(){
            expect(updatedList).toEqual(expectedList);
        });

        it('should return an updated cart list\
        with length reduced by 1',function(){
            expect(updatedList.length).toEqual(expectedList.length);
        });
    });

    describe('Remove item fragment\
    from cart fragment', function(){
        it('should return updated cart\
         fragment', function(){
            TEST_CART_ITEM.forEach(item =>
                cart.list.push(new CartItem(item)));
            let fragment = cart.refreshCart(1);
            expect(fragment.children[0].children.length).toBe(2);
        });
    });

    describe('Update view whenever quantity\
     increments/decrements', function(){
        it('should return an array containing\
        quantity and total fragments', function(){
            TEST_CART_ITEM.forEach(item =>
                cart.list.push(new CartItem(item)));
            cart.displayCart();
            let resultArray = cart.change(cart.list[0]); 
            let expectedQuantity = cart.list[0].quantity;
            let expectedTotal = cart.list[0].total;
            expect(parseInt(resultArray[0].textContent))
            .toBe(expectedQuantity);
            expect(parseInt(resultArray[1].textContent))
            .toBe(expectedTotal);
        });
    });

    // Trial 9 - Calculate total cost for all the items present in cart.
    describe('Calculate Total', function(){
        it('should return total amount\
        ', function(){
            TEST_CART_ITEM.forEach(item =>
                cart.list.push(new CartItem(item)));
            let expectedTotal = cart.list[0].total + 
            cart.list[1].total;
            let total = cart.calculateTotal();
            expect(total).toBe(expectedTotal);
        });
    });
});

// Trial 10 - Create a class for cart item
describe('Create Cart Item', function(){

    beforeEach(function(){
        item = new CartItem(TEST_CART_ITEM[0]);
    });

    describe('Construction of cart item\
    ',function(){

        beforeEach(function(){
            keys = Object.keys(item);
        });

        it('should create a valid CartItem object\
        given id,name,image and price', function(){
            expect(item).toBeInstanceOf(CartItem);
        });

        it('should create an menu item with valid name\
        ',function(){
            let found = keys.findIndex(key => key == 'product');
            let expectedName = TEST_ITEM[1];
            expect(found).toBeGreaterThan(-1);
            expect(item.product).toBeInstanceOf(String);
            expect(item.product).toBe(expectedName);
        });

        it("should create menu item with a valid image url\
        ", function () {
            let found = keys.findIndex(key => key == 'image');
            expect(found).toBeGreaterThan(-1);
            expect(item.image).toBeInstanceOf(String);
            expect(item.image.substring(3,)).
            toMatch(/assets\/product-[0-9]+\.png/);
        });
        
        it("should create menu item with a valid price\
        ", function () {
            let found = keys.findIndex(key => key == 'price');
            let expectedPrice = TEST_ITEM[2];
            expect(found).toBeGreaterThan(-1);
            expect(item.price).toBeInstanceOf(Number);
            expect(item.price).toBe(expectedPrice);
        });

        it("should create menu item with a valid quantity\
        ", function () {
            let found = keys.findIndex(key => key == 'quantity');
            expect(found).toBeGreaterThan(-1);
            expect(item.quantity).toBeInstanceOf(Number);
            expect(item.quantity).toBe(1);
        });

        it("should create menu item with a valid total\
        ", function () {
            let found = keys.findIndex(key => key == 'total');
            let expectedTotal = TEST_ITEM[2];
            expect(found).toBeGreaterThan(-1);
            expect(item.total).toBeInstanceOf(Number);
            expect(item.total).toBe(expectedTotal);
        });
    });


    describe('Increment quantity and total\
    ', function(){
        it('should return an array containing\
         quantity and total after increment\
         ', function(){
            expectedQuantity = item.quantity + 1;
            expectedTotal = item.total + item.price;
            resultArray = item.incrementItem();
            expect(resultArray[0]).toBe(expectedQuantity);
            expect(resultArray[1]).toBe(expectedTotal);
        });
    });

    describe('Decrement quantity and total\
    ', function(){
        it('should return an array containing\
         quantity and total after decrement\
         ', function(){
            expectedQuantity = item.quantity - 1;
            expectedTotal = item.total - item.price;
            resultArray = item.decrementItem();
            expect(resultArray[0]).toBe(expectedQuantity);
            expect(resultArray[1]).toBe(expectedTotal);
        });
    });

    describe('View Cart Item', function(){

        beforeEach(function(){
            fragmentArray = item.displayItem(); 
        });

        it('should return an array containing HTML\
        elements of length six', function(){
            expect(fragmentArray.length).toBe(6);
        });

        it('should return a HTML element with\
        valid product image', function(){
            let expectedImage = item.image; 
            expect(fragmentArray[0].children[0].
            getAttribute('src')).toBe(expectedImage);
       });

        it('should return a HTML element with\
        valid product name', function(){
            let expectedName = item.product; 
            expect(fragmentArray[1].textContent).toBe(expectedName);
       });

       it('should return HTML elements with\
       valid price', function(){
            let expectedPrice = item.price;
            expect(parseInt(fragmentArray[2].textContent)).
            toBe(expectedPrice);
        });

        it('should return a HTML element with\
        valid quantity', function(){
            let expectedQuantity = item.quantity;
            expect(parseInt(fragmentArray[3].textContent)).
            toBe(expectedQuantity);
        });

        it('should return a HTML element with\
        valid total', function(){ 
            let expectedQuantity = item.total;
            expect(parseInt(fragmentArray[4].textContent)).
            toBe(expectedQuantity);
        });

        it('should return a HTML element with\
        valid attribute', function(){
            expect(fragmentArray[5].children[0].
                hasAttribute('data-feather')).
                toBeTrue();
        });
    });
});