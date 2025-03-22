import { UserDocument } from '../../users/admin/users.schema';
import { CustomerDocument } from '../../users/customer/customers.schema';

export interface ILoginRequest extends Request {
  user: UserDocument;
}

export interface ICustomerLoginRequest extends Request {
  user: CustomerDocument;
}

export interface ResponseUserAuth {
  email: string;
  role: string;
}
