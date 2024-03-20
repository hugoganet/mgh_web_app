// Check if a record already exist in db for the sku and order-id. If it does, update order-status and quantity.

// If order-type == 'Return'
  // 

  // If order-status == 'Pending', add the SKU to the incomming order file.

  // If order-status == 'Canceled', remove the SKU from the incomming order file.

  // If order-status == 'Completed', add the quantity to the corresponding warehouse stock. (Every orders from 19/03/24 will be send to DOCK AVENUE)


// If order-type == 'Disposal' || 'Liquidations'
// ! No need to create another table to store Disposed or liquidated items as I will have the removal orders table.
// ? Do I have to update AFN stock for disposed items ?
// NO. My AFN stock quantities are uopdated directly from the report data daily. I need to be able to know the details on how I end up with those quantity, but that's all.

// Convert removal fees to EUR and store them in the database.
