const ITEMS = [
    'Caffè Americano',
    'Cappuccino',
    'Cold Brew',
    'Iced Black Tea',
    'Creame Frappuccino',
    'Matcha Green Tea',
    'Matcha Lemonade',
    'Peppermint Shake',
    'Salted Caramel',
    'Hot Chocolate',
    'Hibiscus Lemonade'
];

const PRICE = [180,200,150,300,180,150,250,300,270,200,150];

// Create a class for MenuItem 
class MenuItem{
    constructor(id,name,price)
    {
        this.id = id;
        this.name = name;
        this.image = `../assets/product-${id}.png`;
        this.price = price;
    }
   
    // Write a function to return menu item as a HTML element
    getItem = () =>{
        let menuItem = document.createElement('div');
        menuItem.classList.add('item');
        menuItem.setAttribute('data-id', this.id);
        let image = document.createElement('img');
        image.setAttribute('src',this.image);
        image.classList.add('product-img');
        let overlay = document.createElement('div');
        overlay.classList.add('overlay');
        let button = document.createElement('button');
        button.classList.add('add-cart-btn');
        button.textContent = 'Add To Cart';
        let footer = document.createElement('div');
        footer.classList.add('cart-footer');
        let name = document.createElement('b');
        name.classList.add('name');
        name.textContent = this.name;
        let price = document.createElement('b');
        price.classList.add('price');
        price.textContent = this.price;
        footer.append(name,price);
        menuItem.append(image,overlay,button,footer);
        return menuItem;
    }
}

// Create a class for Menu
class Menu{
    constructor(items,priceList)
    {
       this.items = items.map((value,key) => 
       // Use Oops Composition concept
       new MenuItem(key+1,value,priceList[key]));
       this.cart = new Cart();
       Array.from(document.getElementsByClassName('item-holder'))
       .forEach(elem => elem
            .addEventListener('click', (e) => {
                e.target.classList.value === 'add-cart-btn' ? 
                this.addToCart(e.target.parentNode) : null;
        }));
        
    }

    // Write a function to return array of HTML element
    //  for all the menu items.
    displayCatalogue= () =>{
        let fragment = this.items.map(item => item.getItem());
        return fragment; 
    }
    
    // Write a function to add menu items to cart
    addToCart = (target) => {
        if (!target.hasAttribute('data-id'))
        return;
        let productId = target.getAttribute('data-id');
        let availableCartItem = this.cart.checkAvailability(productId);
        typeof(availableCartItem) == 'undefined' ? 
        this.cart.list.push(new CartItem(this.items[productId-1])) : 
        (availableCartItem.quantity < 20) && 
        availableCartItem.incrementItem();
        this.cart.calculateTotal();
        return this.cart.list;
    }

    searchItems = (keyword) => {
        return this.items.filter(item =>
            new RegExp(keyword.toLowerCase())
            .test(item.name.toLowerCase()))
            .sort((a,b) => a.name.localeCompare(b.name))
            .map(item => item.name);
    }
    
}

// Create a class for cart
class Cart{
    constructor(){
        this.list = [];
        this.total = 0;
        Array.from(document.getElementsByClassName('item-summary'))
        .forEach(elem => elem
            .addEventListener('click', (e) => {
                e.target.classList.value === 'feather feather-plus plus' ?
                this.handleIncrementClick(e.target.nextSibling.parentNode) : 
                e.target.classList.value === 'feather feather-minus minus' ?
                this.handleDecrementClick(e.target.previousSibling.parentNode) :
                e.target.classList.value === 'feather feather-x-circle' ?
                this.handleRemoveClick(e.target.parentNode) : null;
            }));
    }

    // Write a function to return an array of HTML elements
    //  for cart
    displayCart = () => {
        let thumbnail = document.createElement('div');
        thumbnail.classList.add('thumbnail');
        thumbnail.setAttribute('id','thumbnails');
        let thumbnailHead = document.createElement('span');
        thumbnailHead.classList.add('image-head');
        let product = document.createElement('div');
        product.classList.add('product');
        product.setAttribute('id','products');
        let productHead = document.createElement('span');
        productHead.classList.add('product-head');
        productHead.textContent = 'PRODUCT';
        let price = document.createElement('div');
        price.classList.add('price');
        price.setAttribute('id','prices');
        let priceHead = document.createElement('span');
        priceHead.classList.add('amount-head');
        priceHead.textContent = 'PRICE';
        let quantity = document.createElement('div');
        quantity.classList.add('quantity');
        quantity.setAttribute('id','quantity-holder');
        let quantityHead = document.createElement('span');
        quantityHead.classList.add('qty-head');
        quantityHead.textContent = 'QUANTITY';
        let total = document.createElement('div');
        total.classList.add('total');
        total.setAttribute('id','total-holder');
        let totalHead = document.createElement('span');
        totalHead.classList.add('total-cost-head');
        totalHead.textContent = 'TOTAL';
        let remove = document.createElement('div');
        remove.classList.add('remove');
        remove.setAttribute('id','remover');
        let removeHead = document.createElement('span');
        removeHead.classList.add('remove-icon-head');
        thumbnail.append(thumbnailHead);
        product.append(productHead);
        price.append(priceHead);
        quantity.append(quantityHead);
        total.append(totalHead);
        remove.append(removeHead);
        this.list.map(cartItem => cartItem.displayItem())
                       .forEach(data => {
                            thumbnail.append(data[0]);
                            product.append(data[1]);
                            price.append(data[2]);
                            quantity.append(data[3]);
                            total.append(data[4]);
                            remove.append(data[5]);
                        });
        return [thumbnail,product,price,quantity,total,remove];
    }
    
    // Check if particular item is present in cart or not
    checkAvailability = (productId) =>{
        return this.list.find(item=> item.id == productId);
    } 
    
    // Increment the quantity of item in cart
    handleIncrementClick = (target) => {
        if (!target.hasAttribute('data-id'))
        return;
        let productId = target.getAttribute('data-id');
        let availableCartItem = this.checkAvailability(productId);
        availableCartItem.quantity < 20 && availableCartItem.incrementItem();
        target.classList.value === 'qty'? (availableCartItem.quantity <= 20) && 
        this.change(availableCartItem): null;
        this.calculateTotal();
        return this.list;
    }
    
    // Decrement the quantity of item in cart
    handleDecrementClick = (target) => {
        if (!target.hasAttribute('data-id'))
        return;
        let productId = target.getAttribute('data-id');
        let availableCartItem = this.checkAvailability(productId);
        if(availableCartItem.quantity === 1)
            return this.refreshCart(productId);
        availableCartItem.decrementItem();
        this.change(availableCartItem);
        this.calculateTotal();
        return this.list;
    }
    
    // Remove item from cart
    handleRemoveClick = (target) => {
        if (!target.hasAttribute('data-id'))
        return;
        let productId = target.getAttribute('data-id');
        this.refreshCart(productId);
        return this.list;
    }
    
    // Remove items that are not present in cart from cart fragment
    refreshCart = (productId) => {
        let cartContainer = document.getElementById('cart-summary');
        cartContainer.innerHTML = '';
        this.deleteItem(productId);
        let fragment = this.displayCart();
        cartContainer.append(...fragment);
        feather.replace();
        this.calculateTotal();
        return cartContainer;
    }
    
    // Remove item from cart
    deleteItem = (productId) => {
        this.list = this.list.filter(item => item.id != productId)
        return this.total;
    }
    
    // Update HTML element for every 
    // cartItem Increment/decrement
    change = (item) => {
        let quantity = document.getElementById(`qty-of-item-${item.id}`);
        let total = document.getElementById(`total-of-item-${item.id}`);
        quantity.textContent = item.quantity;
        total.textContent = item.total;
        return [quantity,total];
    }
    
    // Calculate total amount to be paid
    calculateTotal = () => {
        this.total = this.list.map(item => item.total)
                                          .reduce((sum,price) => 
                                                    sum + price,0);
        let subtotal = document.getElementById('sub-total');
        subtotal.textContent = `Rs. ${this.total}`;
        return this.total;
    }

}

// Create a class for cart item
class CartItem{
    constructor({id,name,image,price}){
        this.id = id;
        this.image = image;
        this.product = name;
        this.price = price;
        this.quantity = 1;
        this.total = price;
    }
     
    // Increment quantity and total of a cart item
    incrementItem = () => {
        this.quantity += 1;
        this.total += this.price;
        return [this.quantity,this.total];
    }
 
    // Decrement quantity and total of a cart item
    decrementItem = () => {
        this.quantity -= 1;
        this.total -= this.price;
        return [this.quantity,this.total];
    }
 
    // Create HTML elements for each item in cart
    displayItem = () => {
        let thumbnail = document.createElement('span');
        thumbnail.classList.add('thumbnail-img');
        let image = document.createElement('img');
        image.setAttribute('src',this.image);
        image.classList.add('thumb-image');
        thumbnail.append(image);
        let product = document.createElement('b');
        product.classList.add('product-name');
        product.textContent = this.product;
        let amount = document.createElement('b');
        amount.classList.add('amount');
        amount.textContent = this.price;
        let quantity = document.createElement('b');
        quantity.classList.add('qty');
        let incrementIcon = document.createElement('i');
        incrementIcon.setAttribute('data-feather','plus');
        incrementIcon.classList.add('plus');
        let quantityValue = document.createElement('span');
        quantityValue.classList.add('qty-value');
        quantityValue.setAttribute('id',`qty-of-item-${this.id}`);
        quantityValue.textContent = this.quantity;
        let decrementIcon = document.createElement('i');
        decrementIcon.setAttribute('data-feather','minus');
        decrementIcon.classList.add('minus');
        quantity.append(incrementIcon,
        quantityValue,decrementIcon);
        quantity.setAttribute('data-id', this.id);
        let total = document.createElement('b');
        total.classList.add('total-cost');
        total.setAttribute('id',`total-of-item-${this.id}`)
        total.textContent = this.total;
        let remove = document.createElement('b');
        remove.classList.add('remove-icon');
        remove.setAttribute('data-id', this.id);
        let icon = document.createElement('i');
        icon.setAttribute('data-feather','x-circle');
        remove.append(icon);
        return [thumbnail,product,amount,quantity,total,remove];
    }
}

// Create a class Miscellaneous
class Miscellaneous{

    // Include all the basic functionalities
    init = () => {
        document.getElementById('cart-container').style.display = 'none';
        let menu = new Menu(ITEMS,PRICE);
        let menuItems = menu.displayCatalogue();
        let itemsContainer = document.getElementById('items-container');
        let cartSummary = document.getElementById('cart-summary');
        itemsContainer.append(...menuItems);
        feather.replace();
    
        document.getElementById('order-now').onclick = () =>{
            window.location.href = '#category-heading';
        }
    
        document.getElementById('cart-btn').onclick = () => {
            document.getElementById('menu-container').style.display = 'none';
            document.getElementById('category-heading').style.display = 'none';
            itemsContainer.style.display = 'none';
            document.getElementById('cart-container').style.display = 'block';
            cartSummary.innerHTML = '';
            let fragment = menu.cart.displayCart();
            cartSummary.append(...fragment);
            feather.replace();
        }
    
        document.getElementById('view-menu').onclick = () => {
            document.getElementById('cart-container').style.display = 'none';
            itemsContainer.style.display = 'grid';
            document.getElementById('menu-container').style.display = 'grid';
            document.getElementById('category-heading').style.display = 'block';
        }
    }
}


window.onload = () =>{
    let miscellaneous = new Miscellaneous();
    miscellaneous.init();
}