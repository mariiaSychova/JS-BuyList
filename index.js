let shoppingList = [
    {
        id: 1,
        name: "Помідори",
        quantity: 2,
        isBought: true,
        isEditing: false,
    },
    {
        id: 2,
        name: "Печиво",
        quantity: 2,
        isBought: false,
        isEditing: false,
    },
    {
        id: 3,
        name: "Сир",
        quantity: 1,
        isBought: false,
        isEditing: false,
    },
]

const createItem = (item) => {
    const res = document.createElement("div")

    const { id, name, quantity, isBought, isEditing } = item

    res.className = isBought ? "item deleted" : "item" 

    res.innerHTML = `${isEditing ? `<div class="item-name">
                                    <input id="edit-input" class="edit-input" type="text" value="${name}" onblur="editItem(${id})"/>
                                    </div>` : `<span class="item-name" onClick="editItem(${id})">${name}</span>`
                    }

                    <div class="item-quantity">
                        ${
                            isBought
                                ? ""
                                : `<button
                                        class="minus-btn tooltip"
                                        data-tooltip="Зменшити кількість продукту"
                                        onClick="changeNumberOfItem(${id}, -1)"
                                        ${quantity === 1 ? 'disabled' : ''}
                                    >
                                        -
                                    </button>`
                        }
                        <span class="quantity">${quantity}</span>
                        ${
                            isBought
                                ? ""
                                : `<button
                                        class="plus-btn tooltip"
                                        data-tooltip="Збільшити кількість продукту"
                                        onClick="changeNumberOfItem(${id}, 1)"
                                    >
                                        +
                                    </button>`
                        }
                    </div>

                    <div class="item-state">
                        <button class="buy-btn" onClick="buyItem(${id})">${isBought ? "Зробити не купленим" : "Зробити купленим"}</button>
                        <span 
                            class="purchase-state"
                        >
                            ${isBought ? "Куплено" : "Не куплено"}
                        </span>
                        ${
                            isBought
                                ? ""
                                : `<button
                                        class="remove-btn tooltip"
                                        data-tooltip="Прибрати продукт з кошика"
                                        onClick="deleteItem(${id})"
                                    >
                                        x
                                    </button>`
                        }
                        
                    </div>`

    return res
}

const createStatsItem = (item) => {
    const res = document.createElement("span")

    const { name, quantity, isBought } = item

    res.className = isBought ? "product-item removed" : "product-item"

    res.innerHTML = `${name}
    <span class="amount">${quantity}</span>
    `

    return res
}

const drawItems = () => {
    const cartItems = document.getElementById("cart-items")

    if (!cartItems) return

    cartItems.innerHTML = ""
    shoppingList.forEach((item) => cartItems.appendChild(createItem(item)))
}

const drawStatsItem = () => {
    const statsItems = document.getElementById("not-bought-items")

    const notDeletedItems = shoppingList.filter((item) => !item.isBought)

    statsItems.innerHTML = ''
    notDeletedItems.forEach((item) => statsItems.appendChild(createStatsItem(item)))

    const deletedStatsItems = document.getElementById("bought-items")

    const deletedItems = shoppingList.filter((item) => item.isBought)

    deletedStatsItems.innerHTML = ''
    deletedItems.forEach((item) => deletedStatsItems.appendChild(createStatsItem(item)))
}

const changeNumberOfItem = (id, delta) => {
    const thisItem = shoppingList.find((item) => item.id === id)

    if (!thisItem) return

    thisItem.quantity += delta

    drawItems()
    drawStatsItem()
}

const deleteItem = (id) => {
    shoppingList = shoppingList.filter((item) => item.id !== id)

    drawItems()
    drawStatsItem()
}

const buyItem = (id) => {
    const thisItem = shoppingList.find((item) => item.id === id)

    if (!thisItem) return

    thisItem.isBought = !thisItem.isBought

    drawItems()
    drawStatsItem()
}

const addItem = () => {
    const input = document.getElementById("search-input")

    if (!input) return

    const name = input.value
    input.value = ""
    input.focus()

    if (!name) return

    const newId = Math.max(...shoppingList.map((item) => item.id)) + 1

    shoppingList.push({
        id: newId,
        name,
        quantity: 1,
        isBought: false,
    })

    drawItems()
    drawStatsItem()
}

const editItem = (id) => {
    const editingItem = shoppingList.find((item) => item.id === id)

    if (!editingItem || editingItem.isBought) return

    if (editingItem.isEditing) {
        const input = document.getElementById('edit-input')

        if (!input) return 

        editingItem.name = input.value
    }
    editingItem.isEditing = !editingItem.isEditing

    drawItems()
    drawStatsItem()

    const input = document.getElementById('edit-input')

    if (!input) return 
    
    input.focus()
}

drawItems()
drawStatsItem()

document.getElementById("search-input").addEventListener('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) addItem()
})