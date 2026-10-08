import { ServiceManagementService } from '../services/serviceManagementService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ServiceController {
  static async requestService(req, res, next) {
    try {
      const serviceReq = await ServiceManagementService.requestService(req.body, req.user);
      return ApiResponse.created(res, 'Service request booked successfully', { serviceRequest: serviceReq });
    } catch (error) {
      next(error);
    }
  }

  static async getServiceRequests(req, res, next) {
    try {
      const requests = await ServiceManagementService.getServiceRequests(req.query);
      return ApiResponse.success(res, 'Service requests retrieved', { serviceRequests: requests });
    } catch (error) {
      next(error);
    }
  }

  static async getServiceByTicket(req, res, next) {
    try {
      const serviceReq = await ServiceManagementService.getServiceByTicket(req.params.ticketNumber);
      return ApiResponse.success(res, 'Service request details retrieved', { serviceRequest: serviceReq });
    } catch (error) {
      next(error);
    }
  }

  static async getMyServiceRequests(req, res, next) {
    try {
      const requests = await ServiceManagementService.getCustomerServiceHistory(req.user.id);
      return ApiResponse.success(res, 'Customer service requests retrieved', { serviceRequests: requests });
    } catch (error) {
      next(error);
    }
  }

  static async updateServiceStatus(req, res, next) {
    try {
      const serviceReq = await ServiceManagementService.updateServiceStatus(req.params.id, req.body, req.user);
      return ApiResponse.success(res, 'Service request status updated', { serviceRequest: serviceReq });
    } catch (error) {
      next(error);
    }
  }
}
