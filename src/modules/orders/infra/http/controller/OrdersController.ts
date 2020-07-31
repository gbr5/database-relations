import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findOrder = container.resolve(FindOrderService);

    const order = await findOrder.execute({ id });

    const products = order?.orders_products.map(product => {
      return {
        product_id: product.product_id,
        price: product.price,
        quantity: product.quantity,
      };
    });

    const customer = {
      id: order?.customer.id,
      name: order?.customer.name,
      email: order?.customer.email,
    };

    const newOrder = {
      customer,
      orders_products: products,
    };

    return response.json(newOrder);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrder = await container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customer_id,
      products,
    });

    const newProducts = order?.orders_products.map(product => {
      return {
        product_id: product.product_id,
        price: product.price,
        quantity: product.quantity,
      };
    });

    const customer = {
      id: order?.customer.id,
      name: order?.customer.name,
      email: order?.customer.email,
    };

    const newOrder = {
      customer,
      orders_products: newProducts,
    };

    return response.json(newOrder);
  }
}
