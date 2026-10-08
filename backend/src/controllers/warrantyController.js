import { WarrantyService } from '../services/warrantyService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class WarrantyController {
  static async registerWarranty(req, res, next) {
    try {
      const warranty = await WarrantyService.registerWarranty(req.body, req.user);
      return ApiResponse.created(res, 'Warranty registered successfully', { warranty });
    } catch (error) {
      next(error);
    }
  }

  static async verifyWarranty(req, res, next) {
    try {
      const warranty = await WarrantyService.verifyWarrantyBySerial(req.params.serialNumber);
      return ApiResponse.success(res, 'Warranty verification details retrieved', { warranty });
    } catch (error) {
      next(error);
    }
  }

  static async fileClaim(req, res, next) {
    try {
      const claim = await WarrantyService.fileWarrantyClaim(req.params.serialNumber, req.body, req.user);
      return ApiResponse.created(res, 'Warranty claim filed successfully', { claim });
    } catch (error) {
      next(error);
    }
  }

  static async getAllWarranties(req, res, next) {
    try {
      const warranties = await WarrantyService.getAllWarranties(req.query);
      return ApiResponse.success(res, 'Warranties retrieved successfully', { warranties });
    } catch (error) {
      next(error);
    }
  }
}
