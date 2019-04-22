const
    imagesPath = './images', 
    paintings = {
        painting1: {
            description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Pellentesque ipsum.',
            id: 'painting1',
            image: imagesPath + '/image-1.jpg',
            imageUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/data/14/14.json',
            name: 'Buildings',
            price: 30
        },
        painting2: {
            description: 'Curabitur sagittis hendrerit ante. Fusce nibh. Etiam posuere lacus quis dolor. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Cras elementum.',
            id: 'painting2',
            image: imagesPath + '/image-2.jpg',
            imageUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/data/13/13.json',
            name: 'Boats',
            price: 40
        },
        painting3: {
            description: 'Proin mattis lacinia justo. Sed convallis magna eu sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.',
            id: 'painting3',
            image: imagesPath + '/image-3.jpg',
            imageUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/data/12/12.json',
            name: 'Flowers',
            price: 50
        }
    };



Utils.eventDispatcher
    .addListener('item-added-popup', apicart.cart.events.ITEM_ADDED, function (itemData, quantity) {
        console.log(itemData, quantity);
    })
    .addListener('cart-updated', apicart.cart.events.UPDATED, function (cart) {
        cartStore.commit('updateItemsPrice', apicart.cart.manager.getItemsPrice());
        cartStore.commit('updateItemsCount', apicart.cart.manager.getItemsCount());
        cartStore.commit('updateItems', cart.items);
    });

let cartStore = new Vuex.Store({
    state: {
        itemsPrice: (function () {
            return apicart.cart.manager.getItemsPrice();
        })(),
        itemsCount: (function (){
            return apicart.cart.manager.getItemsCount();
        })(),
        items: (function () {
            return apicart.cart.manager.getCart().items;
        })()
    },
    mutations: {
        updateItemsPrice(state, payload) {
            state.itemsPrice = payload;
        },
        updateItemsCount(state, payload) {
            state.itemsCount = payload; 
        },
        updateItems(state, payload) {
            state.items = payload;
        }
    }
});

let selectedPaintingStore = new Vuex.Store({
    state: {
        selectedPainting: 'painting1'
    },
    mutations: {
        selectPainting(state, payload) {
            state.selectedPainting = payload;
        }
    }
})


let cartButtonView = new Vue({
    el: '#cart-button-view',
    computed: {
        cart() {
            return cartStore.state;
        }
    },
    template: '#cart-button-template'
});

let paintingsSelectboxView = new Vue({
    el: '#paintings-selectbox-view',
    data: {
        paintings: paintings
    },
    methods: {
        selectPainting(event) {
            selectedPaintingStore.commit('selectPainting', event.target.value);
        }
    },
    template: '#paintings-selectbox-template'
});

let paintingDescriptionView = new Vue({
    el: '#painting-description-view',
    computed: {
        selectedPainting() {
            console.log(paintings[selectedPaintingStore.state.selectedPainting]);
            return paintings[selectedPaintingStore.state.selectedPainting];
        }
    },
    template: '#painting-description-template'
});

let paintingImageView = new Vue({
    el: '#painting-image-view',
    computed: {
        selectedPainting() {
            return paintings[selectedPaintingStore.state.selectedPainting];
        }
    },
    template: '#painting-image-template'
});

Vue.component('modal', {
    template: '#modal-template'
});

let addToCartPopupView = new Vue({
    el: '#add-painting-to-cart-popup-view',
    data: {
        showModal: false,
        itemName: '',
        itemImage: ''
    },
    methods: {
        showOrderRecapitulation() {
            this.showModal = false;
            showCardBack();
        }
    }
});

let addToCartFormView = new Vue({
    el: '#add-to-cart-form-view',
    data: {
        quantity: 1
    },
    computed: {
        selectedPainting() {
            return paintings[selectedPaintingStore.state.selectedPainting];
        }
    },
    methods: {
        addPaintingToCart() {
            let 
                selectedPainting = this.selectedPainting,
                inputQuantity = this.quantity;

            apicart.cart.manager.addItem(selectedPainting.imageUrl, this.quantity, function (itemData, quantity) {
                addToCartPopupView.itemImage = './images/image-1.jpg',
                addToCartPopupView.itemName = itemData.name;
                addToCartPopupView.showModal = true;
                inputQuantity = 1;
            });
        }
    },
    template: '#add-to-cart-form-template'
});

apicart.shippingMethods.manager.getShippingMethods(null, function(responseIsOk, response) {
    let shippingMethodsSelectboxView = new Vue({
        el: '#shipping-methods-selectbox-view',
        data: {
            shippingMethods: responseIsOk ? response.data.findShippingMethods.shippingMethods : null
        },
        template: '#shipping-methods-selectbox-template'
    });
});


apicart.paymentMethods.manager.getPaymentMethods(null, function(responseIsOk, response) {
    new Vue({
        el: '#payment-methods-selectbox-view',
        data: {
            paymentMethods: responseIsOk ? response.data.findPaymentMethods.paymentMethods : null
        },
        template: '#payment-methods-selectbox-template'
    });
});



function showCardBack() {
    document.querySelector('.flip-card').classList.add('show-card-back');
}


function showCardFront() {
    document.querySelector('.flip-card').classList.remove('show-card-back');
}