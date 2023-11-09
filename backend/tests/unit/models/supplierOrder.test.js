const { initializeDatabase, closeDatabase, db } = require('../../jest.setup');

describe(`SupplierOrder Model Tests`, () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  // Create a valid SupplierOrder
  test('Create a valid SupplierOrder', async () => {
    const newSupplierOrder = await db.SupplierOrder.create({
      supplierId: 1,
      supplierOrderMadeDate: new Date(),
      warehouseId: 1,
      supplierOrderNumberOfUnit: 100,
      supplierOrderTotalPaidExc: 1000.0,
      supplierOrderDeliveryCostExc: 100.0,
      supplierOrderDeliveryCostVatRate: 0.2,
      supplierOrderVatPaid: 200.0,
    });
    expect(newSupplierOrder).toHaveProperty('supplierOrderId');
    expect(parseFloat(newSupplierOrder.supplierOrderNumberOfUnit)).toEqual(100);
  });

  // Fail to create a SupplierOrder with constraint errors or datatype errors
  test('Fail to create a valid SupplierOrder', async () => {
    await expect(
      db.SupplierOrder.create({
        supplierId: 1,
        supplierOrderMadeDate: new Date(),
        warehouseId: 1,
        supplierOrderNumberOfUnit: 100,
        supplierOrderTotalPaidExc: 1000.0,
        supplierOrderDeliveryCostExc: 100.0,
        supplierOrderDeliveryCostVatRate: null, // null value for not null field
        supplierOrderVatPaid: 200.0,
      }),
    ).rejects.toThrow();
  });

  // Update a SupplierOrder
  test('Update a valid SupplierOrder', async () => {
    const updatedOrder = await db.SupplierOrder.update(
      {
        supplierOrderDeliveryDate: new Date(),
      },
      {
        where: { supplierOrderId: 1 }, // Assuming supplier order with ID 1 exists
      },
    );
    expect(updatedOrder).toEqual([1]); // [1] indicates one row was updated
  });

  // Test creating and then deleting a SupplierOrder
  test('Create and then delete a SupplierOrder', async () => {
    // Create a new SupplierOrder instance
    const newSupplierOrder = await db.SupplierOrder.create({
      supplierId: 1,
      supplierOrderMadeDate: new Date(),
      warehouseId: 1,
      supplierOrderNumberOfUnit: 100,
      supplierOrderTotalPaidExc: 1000.0,
      supplierOrderDeliveryCostExc: 100.0,
      supplierOrderDeliveryCostVatRate: 0.2,
      supplierOrderVatPaid: 200.0,
    });
    // Check that the new SupplierOrder has been created
    expect(newSupplierOrder).toHaveProperty('supplierOrderId');

    const createdOrderId = newSupplierOrder.supplierOrderId;

    // Now, delete the created SupplierOrder
    const deleteCount = await db.SupplierOrder.destroy({
      where: { supplierOrderId: createdOrderId },
    });

    // Check that the delete operation was successful
    expect(deleteCount).toBe(1);

    // Optionally, verify that the SupplierOrder no longer exists
    const deletedOrder = await db.SupplierOrder.findByPk(createdOrderId);
    expect(deletedOrder).toBeNull();
  });

  // Fail to create a SupplierOrder due to unexisting foreign key (Supplier)
  test('Fail to create an SupplierOrder due to unexisting foreign key (Supplier)', async () => {
    await expect(
      db.SupplierOrder.create({
        supplierId: 9999, // non-existing supplier ID
        supplierOrderMadeDate: new Date(),
        warehouseId: 1,
        supplierOrderNumberOfUnit: 100,
        supplierOrderTotalPaidExc: 1000.0,
        supplierOrderDeliveryCostExc: 100.0,
        supplierOrderDeliveryCostVatRate: 0.2,
        supplierOrderVatPaid: 200.0,
      }),
    ).rejects.toThrow();
  });

  // Fail to create an SupplierOrder due to unexisting foreign key (Warehouse)
  test('Fail to create an SupplierOrder due to unexisting foreign key (Warehouse)', async () => {
    await expect(
      db.SupplierOrder.create({
        supplierId: 1,
        supplierOrderMadeDate: new Date(),
        warehouseId: 9999, // non-existing warehouse ID
        supplierOrderNumberOfUnit: 100,
        supplierOrderTotalPaidExc: 1000.0,
        supplierOrderDeliveryCostExc: 100.0,
        supplierOrderDeliveryCostVatRate: 0.2,
        supplierOrderVatPaid: 200.0,
      }),
    ).rejects.toThrow();
  });

  // Retrieve total quantity of ean in SupplierOrder.supplierOrderId(1)
  test('Retrieve total quantity of ean in SupplierOrder.supplierOrderId(1)', async () => {
    // Find the SupplierOrder with its associated EANs
    const supplierOrder = await db.SupplierOrder.findByPk(1, {
      include: {
        model: db.Ean, // This assumes db.Ean is the associated model name
        through: {
          model: db.EanInSupplierOrder,
          attributes: ['eanOrderedQuantity'], // Assuming this is the attribute name that holds the quantity
        },
      },
    });

    // If supplierOrder is null, then it wasn't found and we can't proceed
    if (!supplierOrder) {
      throw new Error('SupplierOrder with id 1 not found');
    }

    // Calculate the total quantity from the associated EANs
    let totalQuantity = 0;
    if (supplierOrder.Eans && supplierOrder.Eans.length > 0) {
      totalQuantity = supplierOrder.Eans.reduce((acc, item) => {
        return (
          acc +
          (item.EanInSupplierOrder
            ? item.EanInSupplierOrder.eanOrderedQuantity
            : 0)
        );
      }, 0);
    }

    expect(totalQuantity).toEqual(1714); // Expected total quantity
  });
});
