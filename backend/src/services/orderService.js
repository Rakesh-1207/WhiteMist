import { OrderRepository } from '../repositories/orderRepository.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { NotificationService } from './notificationService.js';
import { ApiError } from '../utils/apiError.js';

export class OrderService {
  static async checkout(orderPayload, currentUser) {
    if (!orderPayload.items || orderPayload.items.length === 0) {
      throw ApiError.badRequest('Shopping cart is empty');
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of orderPayload.items) {
      let product = await ProductRepository.findByIdOrSlug(item.product_id);
      let resolvedId = 1;
      let resolvedSku = 'WM-LD-2L-BLU';
      let resolvedName = item.name || 'White Mist Product';
      let itemPrice = parseFloat(item.unit_price || item.price || 349);

      if (product) {
        resolvedId = product.dbId || product.id;
        resolvedSku = product.sku;
        resolvedName = product.name + (item.format_name ? ` (${item.format_name})` : '');
        itemPrice = parseFloat(item.unit_price || item.price || product.price);
      } else if (String(item.product_id).includes('bundle')) {
        const bundle = await ProductRepository.getSuperSaverBundle();
        resolvedId = 1;
        resolvedSku = 'WM-COMBO-BUNDLE';
        resolvedName = bundle ? bundle.title : 'White Mist 4kg Mega Saver Laundry Bundle';
        itemPrice = bundle ? bundle.price : 599;
      }

      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        product_id: resolvedId,
        product_name: resolvedName,
        sku: resolvedSku,
        unit_price: itemPrice,
        quantity: item.quantity,
      });
    }

    const shippingAmount = parseFloat(orderPayload.shipping_amount !== undefined ? orderPayload.shipping_amount : (subtotal >= 499 ? 0 : 49));
    const discountAmount = parseFloat(orderPayload.discount_amount || 0);
    const taxAmount = 0.00; // Tax/GST inclusive
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingAmount);

    const orderData = {
      customer_id: currentUser ? currentUser.id : null,
      customer_name: orderPayload.customer_name || (currentUser ? currentUser.full_name : 'Valued Customer'),
      customer_email: orderPayload.customer_email || (currentUser ? currentUser.email : `${orderPayload.customer_phone || 'guest'}@whitemist.in`),
      customer_phone: orderPayload.customer_phone || (currentUser ? currentUser.phone : ''),
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: orderPayload.payment_method || 'UPI',
      payment_status: 'PAID',
      order_status: 'CONFIRMED',
      shipping_address: orderPayload.shipping_address,
      billing_address: orderPayload.billing_address || orderPayload.shipping_address,
      notes: orderPayload.notes || null,
    };

    const createdOrder = await OrderRepository.createOrderWithItems(orderData, validatedItems);

    await NotificationService.sendOrderConfirmation(createdOrder);

    await AuditLogRepository.log({
      user_id: currentUser?.id,
      user_email: createdOrder.customer_email,
      user_role: currentUser?.role || 'GUEST',
      action: 'ORDER_PLACED',
      entity: 'ORDER',
      entity_id: createdOrder.id,
      metadata: { order_number: createdOrder.order_number, total_amount: createdOrder.total_amount },
    });

    return createdOrder;
  }

  static async getOrders(filters) {
    return OrderRepository.findAll(filters);
  }

  static async getOrderById(id) {
    const order = await OrderRepository.findById(id);
    if (!order) throw ApiError.notFound('Order not found');
    return order;
  }

  static async getOrderByNumber(orderNumber) {
    const order = await OrderRepository.findByOrderNumber(orderNumber);
    if (!order) throw ApiError.notFound('Order number not found');
    return order;
  }

  static async getCustomerOrders(customerId, customerEmail = null) {
    return OrderRepository.findByCustomerId(customerId, customerEmail);
  }

  static async updateOrderStatus(id, updateData, adminUser) {
    const order = await OrderRepository.findById(id);
    if (!order) throw ApiError.notFound('Order not found');

    const updated = await OrderRepository.updateStatus(id, updateData);

    await AuditLogRepository.log({
      user_id: adminUser?.id,
      user_email: adminUser?.email,
      user_role: adminUser?.role,
      action: 'ORDER_STATUS_UPDATED',
      entity: 'ORDER',
      entity_id: id,
      metadata: { previousStatus: order.order_status, newStatus: updated.order_status },
    });

    return updated;
  }
}
