type Account = {
  email: string;
  secret: string;
  tag?: Array<string>;
  notes?: string;
}

type AccountWithId = Account & {
  id: string;
}
