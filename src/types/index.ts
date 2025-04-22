export interface Label {
  text: string;
}

export interface AccountRecord {
  id: string;
  labels: Label[];
  type: 'LDAP' | 'LOCAL';
  login: string;
  password: string | null;
}

export interface ValidationErrors {
  login?: boolean;
  password?: boolean;
} 