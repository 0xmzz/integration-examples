const
    imagesPath = './images', 
    paintings = {
        painting1: {
            description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla, et sollicitudin sem purus in lacus. Pellentesque ipsum.',
            id: 'painting1',
            image: imagesPath + '/image-1.jpg',
            imageUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/images/15/15-1556037361-71.jpg',
            name: 'Buildings',
            price: 30,
            productUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/data/15/15.json'
        },
        painting2: {
            description: 'Curabitur sagittis hendrerit ante. Fusce nibh. Etiam posuere lacus quis dolor. In laoreet, magna id viverra tincidunt, sem odio bibendum justo, vel imperdiet sapien wisi sed libero. Cras elementum.',
            id: 'painting2',
            image: imagesPath + '/image-2.jpg',
            imageUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/images/16/16-1556037431-81.jpg',
            name: 'Boats',
            price: 40,
            productUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/data/16/16.json'
        },
        painting3: {
            description: 'Proin mattis lacinia justo. Sed convallis magna eu sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.',
            id: 'painting3',
            image: imagesPath + '/image-3.jpg',
            imageUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/images/17/17-1556037504-54.jpg',
            name: 'Flowers',
            price: 50,
            productUrl: 'https://cdn.apicart.dev/external/wlhv1egho2u4p0e0nkne2mks7f9btigi/data/17/17.json'
        }
    };

let orderSentPopupView = new Vue({
    el: '#order-sent-popup-view',
    data: {
        showModal: false,
    }
});

Utils.eventDispatcher
    .addListener('cart-updated', apicart.cart.events.UPDATED, function (cart) {
        cartStore.commit('updateItemsPrice', apicart.cart.manager.getItemsPrice());
        cartStore.commit('updateItemsCount', apicart.cart.manager.getItemsCount());
        cartStore.commit('updateItems', cart.items);

        if ( ! cart.items.length) {
            showCardFront();
        }
    })
    .addListener('order-sent', apicart.cart.events.FINISHED, function () {
        orderSentPopupView.showModal = true;
    
        setTimeout(function () {
            orderSentPopupView.showModal = false;
        }, 5000);
    });


let cartStore = new Vuex.Store({
    state: {
        itemsPrice: apicart.cart.manager.getItemsPrice(),
        itemsCount: apicart.cart.manager.getItemsCount(),
        items: apicart.cart.manager.getCart().items
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
    methods: {
        showOrderRecapitulation() {
            showCardBack();
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
                self = this;

            apicart.cart.manager.addItem(selectedPainting.productUrl, this.quantity, function (itemData, quantity) {
                addToCartPopupView.itemImage = selectedPainting.imageUrl,
                addToCartPopupView.itemName = itemData.name;
                addToCartPopupView.showModal = true;
                self.inputQuantity = 1;
            });
        }
    },
    template: '#add-to-cart-form-template'
});


let orderRecapitulationView = new Vue({
    el: '#order-recapitulation-view',
    computed: {
        paintings() {
            return cartStore.state.items;
        }
    },
    methods: {
        removeItemFromCart(itemId) {
            apicart.cart.manager.removeItem(itemId);
        }
    },
    template: '#order-recapitulation-template'
});


apicart.shippingMethods.manager.getShippingMethods(null, function(responseIsOk, response) {
    new Vue({
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


document.querySelector('.show-card-front').addEventListener('click', function () {
    showCardFront();
    return false;
});


function showCardBack() {
    if ( ! apicart.cart.manager.getCart().items.length) {
        return;
    }

    document.querySelector('.flip-card').classList.add('show-card-back');
}


function showCardFront() {
    document.querySelector('.flip-card').classList.remove('show-card-back');
}
