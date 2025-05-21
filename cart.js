// Creating the code for a shopping cart

function calculateCart()
{
    resetDisplay();

    updateLog("Working on cart calculations. . .");
    try{
        updateLog('Starting Calculations')
        // call getItems()
        const items = getItems();
        // call validateItem()-- validate all items

        items.forEach(item => {
            validateItem(item.name, item.price, item.index);
        })

        // create an order summary
        let output = `<h3> Order Summary </h3>`
        const {total, discountPercent, discountAmount} = calculateTotal(items)
        const finalTotal = total - discountAmount;
        
        // loop array using forEach
        items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            output += `
            <div>
                <strong> ${item.name} </strong> <br>
                $${item.price.toFixed(2)} * ${item.quantity} = $${itemTotal.toFixed(2)}
            </div>
            `
        });

        // display final total
        output += `
        <div>
            <div> Subtotal : $${total.toFixed(2)} </div>
            <div> Discount : (${discountPercent}%): - $${discountAmount.toFixed(2)} </div>
            <div> Final Total : $${finalTotal.toFixed(2)} </div>
        </div>`


        // to display output on webpage
        document.getElementById('result').innerHTML = output;
        document.getElementById('result').style.color = 'cyan';

    } catch(error) {

    } finally {
        updateLog(`Process complete`)
    };



    console.log("Working on cart calculations. . .");
    getItems() // call get items function
}



// function to calculate discount on total
function calculateDiscount(total)
{
    try{
        // validate if total is number or not
        if(typeof(total) !== 'number')
        {
            throw new TypeError('Total must be a number for discount calculation');
        }

        if(total < 0)
        {
            throw new RangeError('Total cannot be negative for discount calculation');
        }

        if(!Number.isFinite(total))
        {
            throw new InternalError('Total amount exceeds maximum calculable value');
        }

        let discountPercent = 0;
        let discountRange = "";

        if(total >= 100)
        {
            discountPercent = 20;
            discountRange = "$100 or more";
        } else if(total >= 75)
        {
            discountPercent = 15;
            discountRange = '$75 - $99.99';
        } else if(total >= 50)
        {
            discountPercent = 10;
            discountRange = '$50 - $74.99';
        } else if(total >= 25)
        {
            discountPercent = 5;
            discountRange = '$25 - $49.99';
        }


        if(discountPercent > 0)
        {
            updateLog(`Applied ${discountPercent}% discount for order in range ${discountRange}`);
        }
        else {
            updateLog('No discount applied to your order');
        }

        return discountPercent;

    } catch(error) {
        updateLog(`Error in discount calculation: ${error.message}`)
        throw error;
    }
}



// function to calculate total
function calculateTotal(items)
{
    try{
        let total = 0;
        // use for or for array values

        for(let item of items) // what does this do?
        {
            const itemTotal = item.price * item.quantity;

            if(!Number.isFinite(itemTotal)) // what does this do?
            {
                throw new InternalError(' Computational Error: Total exceed maximum value') // what does Internal Error do? what does new do?
            }
            total += itemTotal;
        }

        if(total < 0 || !Number.isFinite(total))
        {
            throw new InternalError(' Computational Error: invalid total calculation');
        }

        // calling calculateDiscount(total);
        const discount = calculateDiscount(total);
        const discountAmount = total * (discountPercent / 100);
        if(!Number.isFinite(discountAmount))
        {
            throw new InternalError(' Computational Error: invalid discount calculation');
        }

        return {total, discountPercent, discountAmount};

    } finally {
        updateLog('Calculation Completed');
    }
}





// function to create an array of objects from the user input values
function getItems()
{
    const items = [];
    const itemDivs = document.getElementsByClassName('item');

    for(let i=1; i <= itemDivs.length; i++)
    {
        items.push({
            name: document.getElementById(`name${i}`).value,
            price: parseFloat(document.getElementById(`price${i}`).value), // 
            quantity: parseInt(document.getElementById(`quantity${i}`).value), // parseInt turns string into a number
            index: i
        })
    }
    console.log(items); // Safety Net //
    return items;
}



function validateItem(name, price, itemNumber)
{
    const nameError = document.getElementById(`name${itemNumber}Error`);
    const priceError = document.getElementById(`price${itemNumber}Error`);

    try{
        nameError.style.display='none'; // no longer display the nameError
        priceError.style.display='none'; // no longer display the priceError

        // item name cannot be blank
        if(name.trim() === "")
        {
            nameError.innerHTML = `Item ${itemNumber} name is required`;
            nameError.style.display='block'; // display as block?
            throw new TypeError(`Item ${itemNumber} name is required`);
        }


        // price is a number and is greater than 0
        if(isNaN(price) || price <= 0)
        {
            priceError.innerHTML = `Item ${itemNumber} price must be greater than 0`;
            priceError.style.display = 'block';
            throw new RangeError(`Item ${itemNumber} price must be greater than 0`);
        }



        // price should not exceed the calculation limit
        if(price > Number.MAX_SAFE_INTEGER)
        {
            priceError.innerHTML = `Item ${itemNumber} price is too large`;
            priceError.style.display = 'block';
            throw new InternalError(`Item ${itemNumber} price exceeds maximum safe value`);
        }
    } finally {
        updateLog(`Validated Item ${itemNumber}`)
    }
}



//  function to update log
function updateLog(message)
{
    const logArea = document.getElementById('log');
    const timestamp = new Date().toLocaleTimeString();
    logArea.innerHTML += `[${timestamp}] ${message}<br>`;
}



// function to reset the display
function resetDisplay()
{
    const errorElements = document.getElementsByClassName('error');
    for(let element of errorElements)
    {
        element.style.display = 'none'
    }
    document.getElementById('log').innerHTML = "";
}