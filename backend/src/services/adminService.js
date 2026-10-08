import { query } from '../database/db.js';

export class AdminService {
  static async getDashboardMetrics() {
    const customersCount = await query(`SELECT COUNT(*) as count FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER')`);
    const productsCount = await query(`SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL`);
    const ordersCount = await query(`SELECT COUNT(*) as count FROM orders`);
    const revenueSum = await query(`SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'PAID'`);
    const enquiriesCount = await query(`SELECT COUNT(*) as count FROM enquiries WHERE status = 'NEW'`);
    const serviceRequestsCount = await query(`SELECT COUNT(*) as count FROM service_requests WHERE status IN ('REQUESTED', 'ASSIGNED', 'SCHEDULED')`);
    const warrantyClaimsCount = await query(`SELECT COUNT(*) as count FROM warranty_claims WHERE status IN ('FILED', 'IN_REVIEW')`);
    const lowStockCount = await query(`SELECT COUNT(*) as count FROM products WHERE available_quantity <= 10 AND deleted_at IS NULL`);

    const recentOrders = await query(`SELECT id, order_number, customer_name, total_amount, order_status, created_at FROM orders ORDER BY id DESC LIMIT 5`);
    const recentEnquiries = await query(`SELECT id, enquiry_number, name, email, phone, location, status, created_at FROM enquiries ORDER BY id DESC LIMIT 5`);
    const recentServices = await query(`SELECT id, ticket_number, customer_name, service_type, status, created_at FROM service_requests ORDER BY id DESC LIMIT 5`);

    return {
      overview: {
        total_customers: customersCount[0]?.count || 0,
        total_products: productsCount[0]?.count || 0,
        total_orders: ordersCount[0]?.count || 0,
        total_revenue: parseFloat(revenueSum[0]?.total || 0),
        new_enquiries: enquiriesCount[0]?.count || 0,
        pending_services: serviceRequestsCount[0]?.count || 0,
        pending_warranty_claims: warrantyClaimsCount[0]?.count || 0,
        low_stock_products: lowStockCount[0]?.count || 0,
      },
      recent_activity: {
        recent_orders: recentOrders,
        recent_enquiries: recentEnquiries,
        recent_services: recentServices,
      },
      chart_data: {
        monthly_sales: [
          { month: 'May', revenue: 120000 },
          { month: 'Jun', revenue: 185000 },
          { month: 'Jul', revenue: 210000 },
          { month: 'Aug', revenue: 290000 },
          { month: 'Sep', revenue: 350000 },
          { month: 'Oct', revenue: 410000 },
        ]
      }
    };
  }
}
