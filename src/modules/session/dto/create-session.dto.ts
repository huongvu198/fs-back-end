import { UserDocument } from '../../users/admin/users.schema';

export class CreateSessionDto {
  hash: string;
  user: UserDocument;
  accessTokenAuth0?: string;
  idTokenAuth0?: string;
  userAuth0Id?: string;
}
