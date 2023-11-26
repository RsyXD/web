$(document).ready(function() {
    var itemQuantity = {};
    var initialItemPrices = {}; 
    var itemPrices = {}; 

    function hitungTotalSetelahPajak(totalSebelumPajak) {
        var pajak = totalSebelumPajak * 0.1;
        var totalSetelahPajak = totalSebelumPajak + pajak;
        return {
            pajak: pajak,
            totalSetelahPajak: totalSetelahPajak
        };
    }

    function updateTotal(total) {
        $('#totalPrice').text('Rp. ' + total.toLocaleString('id-ID'));
    }

    function updatePajak(pajak) {
        $('#taxDiscount').text('Rp. ' + pajak.toLocaleString('id-ID'));
    }

    function updateTotalAmount(totalAmount) {
        $('#totalAmount').text('Rp. ' + totalAmount.toLocaleString('id-ID'));
    }

    function updateTotalAfterQuantityChange() {
        var totalPrice = 0;
        for (var item in itemQuantity) {
            totalPrice += itemPrices[item] * itemQuantity[item];
        }

        var { pajak, totalSetelahPajak } = hitungTotalSetelahPajak(totalPrice);
        updateTotal(totalPrice);
        updatePajak(pajak);
        updateTotalAmount(totalSetelahPajak);
    }

    $('.isi').on('click', function() {
        var $clickedItem = $(this);
        var itemName = $clickedItem.find('p').first().text().trim();
        var itemPriceText = $clickedItem.find('h1').text().trim();
        var itemPrice = parseFloat(itemPriceText.replace('Rp. ', '').replace('.', '').replace(',', '.'));

        if (!isNaN(itemPrice)) {
            var formattedItemName = itemName.replace(/\s+/g, '_').toLowerCase();

            if (!itemQuantity[formattedItemName]) {
                itemQuantity[formattedItemName] = 1;
                itemPrices[formattedItemName] = itemPrice;
                initialItemPrices[formattedItemName] = itemPrice; 
                var newElement = `
                    <div class="barang">
                        <div class="detail-kiri">
                            <p>${itemName}</p>
                            <p class="normal">Unit Price: Rp. ${itemPrice.toLocaleString('id-ID')}</p>
                        </div>
                        <div class="detail-kanan">
                            <p style="text-align: right; font-size: small;">${itemPriceText}</p>
                            <p class="normal" style="display: flex; justify-content: space-between; gap: 4em;">
                                Quantity: <span id="stock_${formattedItemName}">${itemQuantity[formattedItemName]}</span>
                            </p>
                        </div>
                        <button class="remove">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                `;
                $('.belanja').append(newElement);
                updateTotalAfterQuantityChange(); 
            } else {
                itemQuantity[formattedItemName]++;
                var updatedItemPrice = itemPrice * itemQuantity[formattedItemName]; 
                itemPrices[formattedItemName] = itemPrice; 
                $('#stock_' + formattedItemName).text(itemQuantity[formattedItemName]); 
                $('.belanja .barang').each(function() {
                    var currentItemName = $(this).find('.detail-kiri p').first().text().trim();
                    if (currentItemName === itemName) {
                        $(this).find('.detail-kiri .normal').text('Unit Price: Rp. ' + updatedItemPrice.toLocaleString('id-ID')); 
                    }
                });
                updateTotalAfterQuantityChange(); 
            }
        } else {
            console.error('Harga item tidak valid');
        }
    });

   $('.belanja').on('click', '.remove', function() {
    var $item = $(this).closest('.barang');
    var itemNameElement = $item.find('.detail-kiri p').first();
    var itemName = itemNameElement.text().trim();
    var itemPriceText = $item.find('.detail-kiri .normal').text().trim();
    var itemPrice = parseFloat(itemPriceText.replace('Unit Price: Rp. ', '').replace('.', '').replace(',', '.'));

    if (!isNaN(itemPrice)) {
        var formattedItemName = itemName.replace(/\s+/g, '_').toLowerCase();
        var quantityElement = $('#stock_' + formattedItemName);
        var currentQuantity = parseInt(quantityElement.text());

        if (currentQuantity > 1) {
            currentQuantity--;
            quantityElement.text(currentQuantity); 
            itemQuantity[formattedItemName]--; 

            var updatedItemPrice = initialItemPrices[formattedItemName] * currentQuantity;
            $item.find('.detail-kiri .normal').text('Unit Price: Rp. ' + updatedItemPrice.toLocaleString('id-ID'));

            updateTotalAfterQuantityChange();
        } else {
            
            delete itemQuantity[formattedItemName];
            delete itemPrices[formattedItemName];
            $item.remove();
            updateTotalAfterQuantityChange();
        }
    } else {
        console.error('Harga item tidak valid');
    }
});

    
});
