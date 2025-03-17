import { Document } from 'mongoose';

import { Session } from '../session.schema';

export interface ISession extends Session, Document {}
