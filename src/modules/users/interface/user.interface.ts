import { UserDocument } from '../users.schema';

export class UserProfile {
  _id: UserDocument['_id'];
  email: UserDocument['email'];
  name: UserDocument['name'];
  role: string;
}
