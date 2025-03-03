export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  organizationId: string;
  lastLoginTimestamp: Date;
}
