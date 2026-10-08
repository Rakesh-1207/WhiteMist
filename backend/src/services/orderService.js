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
      const product = await ProductRepository.findById(item.product_id);
      if (!product) {
        throw ApiError.notFound(`Product with ID ${item.product_id} not found`);
      }
      if (product.available_quantity < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for product ${product.name}. Available: ${product.available_quantity}`);
      }

      const itemPrice = product.discount_price ? parseFloat(product.discount_price) : parseFloat(product.price);
      subtotal += itemPrice * item.quantity;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        unit_price: itemPrice,
        quantity: item.quantity,
      });
    }

    const taxAmount = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST/Tax
    const shippingAmount = subtotal > 30000 ? 0 : 500; // Free shipping over 30,000
    const discountAmount = orderPayload.discount_amount || 0;
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    const orderData = {
      customer_id: currentUser ? currentUser.id : null,
      customer_name: orderPayload.customer_name || (currentUser ? currentUser.full_name : 'Guest Customer'),
      customer_email: orderPayload.customer_email || (currentUser ? currentUser.email : ''),
      customer_phone: orderPayload.customer_phone || (currentUser ? currentUser.phone : ''),
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: orderPayload.payment_method || 'CREDIT_CARD',
      payment_status: 'PAID',
      order_status: 'PROCESSING',
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

  static async getCustomerOrders(customerId) {
    return OrderRepository.findByCustomerId(customerId);
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
