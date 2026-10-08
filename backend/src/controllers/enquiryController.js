import { EnquiryService } from '../services/enquiryService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class EnquiryController {
  static async submitEnquiry(req, res, next) {
    try {
      const enquiry = await EnquiryService.submitEnquiry(req.body);
      return ApiResponse.created(res, 'Enquiry submitted successfully. Our team will contact you shortly.', { enquiry });
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiries(req, res, next) {
    try {
      const enquiries = await EnquiryService.getEnquiries(req.query);
      return ApiResponse.success(res, 'Enquiries retrieved successfully', { enquiries });
    } catch (error) {
      next(error);
    }
  }

  static async getEnquiryById(req, res, next) {
    try {
      const enquiry = await EnquiryService.getEnquiryById(req.params.id);
      return ApiResponse.success(res, 'Enquiry details retrieved', { enquiry });
    } catch (error) {
      next(error);
    }
  }

  static async updateEnquiryStatus(req, res, next) {
    try {
      const enquiry = await EnquiryService.updateEnquiryStatus(req.params.id, req.body, req.user);
      return ApiResponse.success(res, 'Enquiry status updated successfully', { enquiry });
    } catch (error) {
      next(error);
    }
  }
}
