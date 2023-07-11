type Account = {
  email: string;
  secret: string;
  tag?: string;
  notes?: string;
}

type AccountWithId = Account & {
  id: string;
}
